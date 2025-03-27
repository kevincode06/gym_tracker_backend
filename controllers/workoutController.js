const mongoose = require('mongoose');

// Workout Model
const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  exercise: { type: String, required: true },
  reps: { type: Number, required: true },
  sets: { type: Number, required: true },
  weight: { type: Number, required: true },
  date: { 
    type: Date, 
    required: true,
    default: () => new Date(),
    set: function(val) {
      if (typeof val === 'string') {
        const parsedDate = new Date(val);
        return isNaN(parsedDate) ? new Date() : parsedDate;
      }
      return val instanceof Date ? val : new Date(val);
    }
  }
});

const Workout = mongoose.model('Workout', workoutSchema);

// Controller Functions
const formatDateToYYYYMMDD = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const createWorkout = async (req, res) => {
  try {
    const { name, category, exercise, reps, sets, weight, date } = req.body;

    if (!name || !category || !exercise) {
      return res.status(400).json({
        message: 'Name, category, and exercise are required',
        missingFields: {
          name: !name,
          category: !category,
          exercise: !exercise
        }
      });
    }

    const newWorkout = new Workout({
      name: name.trim(),
      category,
      exercise,
      reps: Number(reps) || 0,
      sets: Number(sets) || 0,
      weight: Number(weight) || 0,
      date: date || new Date()
    });

    await newWorkout.save();

    const responseWorkout = newWorkout.toObject();
    responseWorkout.date = formatDateToYYYYMMDD(newWorkout.date);

    res.status(201).json(responseWorkout);
  } catch (error) {
    console.error('Workout creation error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      message: 'Error creating workout',
      error: error.message
    });
  }
};

const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    
    const formattedWorkouts = workouts.map(workout => {
      const workoutObj = workout.toObject();
      workoutObj.date = formatDateToYYYYMMDD(workout.date);
      return workoutObj;
    });

    res.status(200).json(formattedWorkouts);
  } catch (error) {
    console.error('Fetch workouts error:', error);
    res.status(500).json({
      message: 'Error fetching workouts',
      error: error.message
    });
  }
};

const updateWorkout = async (req, res) => {
  try {
    const { name, category, exercise, reps, sets, weight, date } = req.body;

    if (!name || !category || !exercise) {
      return res.status(400).json({
        message: 'Name, category, and exercise are required',
        missingFields: {
          name: !name,
          category: !category,
          exercise: !exercise
        }
      });
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        category,
        exercise,
        reps: Number(reps) || 0,
        sets: Number(sets) || 0,
        weight: Number(weight) || 0,
        date: date || new Date()
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    const responseWorkout = updatedWorkout.toObject();
    responseWorkout.date = formatDateToYYYYMMDD(updatedWorkout.date);

    res.status(200).json(responseWorkout);
  } catch (error) {
    console.error('Workout update error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      message: 'Error updating workout',
      error: error.message
    });
  }
};

const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.status(200).json({
      message: 'Workout deleted successfully',
      deletedWorkout: workout
    });
  } catch (error) {
    console.error('Workout deletion error:', error);
    res.status(500).json({
      message: 'Error deleting workout',
      error: error.message
    });
  }
};

module.exports = { createWorkout, getWorkouts, updateWorkout, deleteWorkout };