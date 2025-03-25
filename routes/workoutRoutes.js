const express = require('express');
const router = express.Router();
const { createWorkout, getWorkouts, updateWorkout, deleteWorkout } = require('../controllers/workoutController'); // Ensure proper import

// POST request to create a workout
router.post('/', createWorkout);

// GET request to get all workouts
router.get('/', getWorkouts);

// PUT request to update a workout log by ID
router.put('/:id', updateWorkout);

// DELETE request to delete a workout log by ID
router.delete('/:id', deleteWorkout);

module.exports = router;
