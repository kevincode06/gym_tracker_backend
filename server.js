const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const Workout = require('./models/Workout');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Create a new workout
app.post('/api/workouts', async (req, res) => {
  try {
    const { name, category, exercise, reps, sets, weight, date } = req.body;

    if (!name || !category || !exercise) {
      return res.status(400).json({ 
        message: 'Name, category, and exercise are required.',
        missingFields: { name: !name, category: !category, exercise: !exercise }
      });
    }

    const newWorkout = new Workout({
      name: name.trim(),
      category,
      exercise,
      reps: Number(reps) || 0,
      sets: Number(sets) || 0,
      weight: Number(weight) || 0,
      date: date || new Date().toISOString().split('T')[0]
    });

    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (error) {
    console.error('Error saving workout:', error);
    res.status(500).json({ message: 'Error saving workout', error: error.message });
  }
});

// Update an existing workout (PUT route)
app.put('/api/workouts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, exercise, reps, sets, weight, date } = req.body;

    if (!name || !category || !exercise) {
      return res.status(400).json({ 
        message: 'Name, category, and exercise are required.',
        missingFields: { name: !name, category: !category, exercise: !exercise }
      });
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        category,
        exercise,
        reps: Number(reps) || 0,
        sets: Number(sets) || 0,
        weight: Number(weight) || 0,
        date: date || new Date().toISOString().split('T')[0]
      },
      { new: true, runValidators: true }
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Workout not found.' });
    }

    res.status(200).json(updatedWorkout);
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({ message: 'Error updating workout', error: error.message });
  }
});

// Get all workouts
app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ message: 'Error fetching workouts', error: error.message });
  }
});

// Delete a workout
app.delete('/api/workouts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedWorkout = await Workout.findByIdAndDelete(id);

    if (!deletedWorkout) {
      return res.status(404).json({ message: 'Workout not found.' });
    }

    res.status(200).json({ message: 'Workout deleted successfully', deletedWorkout });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ message: 'Error deleting workout', error: error.message });
  }
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
