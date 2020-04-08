const express = require('express');
const router = express.Router();
const Routine = require('../../../models/Routine');
const jwt = require("express-jwt"); 
const jwksRsa = require("jwks-rsa"); 

const authConfig = require('../../../config/keys');

const checkJwt = jwt({
  // Provide a signing key based on the key identifier in the header and the signing keys provided by your Auth0 JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  // Validate the audience (Identifier) and the issuer (Domain).
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

router.get('/',  (req , res) => {
  Routine.find({}).then((routines) => {
    res.send(routines);
  });
});

router.get('/:id', checkJwt, (req, res) => {
  const id = req.params.id;
  Routine.findById(id, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.post('/', (req, res) => {
  const {name, type, categories, sets, reps, time, notes, userId} = req.body;
  // Validation?
  const newRoutine = new Routine({
    name,
    type,
    categories,
    sets,
    reps,
    time,
    notes,
    userId
  });
  newRoutine.save()
  .then(routines => {
    res.send(routines)
  })
  .catch(err => console.log(err));
});

module.exports = router;

