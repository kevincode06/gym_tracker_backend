const Workout = require('../models/workoutModel');

// Create a workout
const createWorkout = async (req, res) => {
  const { name, category, exercise, reps, sets, weight, date } = req.body;

  try {
    // Ensure 'name' is provided
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const newWorkout = new Workout({
      name, 
      category,
      exercise,
      reps,
      sets,
      weight,
      date,
    });

    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (error) {
    res.status(500).json({ message: 'Error creating workout', error });
  }
};

// Get all workouts
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workouts', error });
  }
};

// Update a workout by ID
const updateWorkout = async (req, res) => {
  const { name, category, exercise, reps, sets, weight, date } = req.body;

  try {
    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      { name, category, exercise, reps, sets, weight, date },
      { new: true }  // Return the updated workout
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Workout log not found' });
    }

    res.status(200).json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ message: 'Error updating workout log', error });
  }
};

// Delete a workout log by ID
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout log not found' });
    }

    res.status(200).json({ message: 'Workout log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workout log', error });
  }
};

module.exports = { createWorkout, getWorkouts, updateWorkout, deleteWorkout };
