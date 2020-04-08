const express = require('express');
const router = express.Router();
const Routine = require('../../../models/Routine');


router.get('/',  (req , res) => {
  Routine.find({}).then((routines) => {
    res.send(routines);
  });
});

router.get('/:id', (req, res) => {
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

