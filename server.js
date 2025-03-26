const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const exerciseRoutes = require('./routes/exerciseRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const Workout = require('./models/Workout'); // Add the Workout model to handle workout data

dotenv.config();
connectDB();  // Connect to MongoDB

const app = express();
app.use(cors());
app.use(express.json());

// Define routes
app.use('/exercises', exerciseRoutes);
app.use('/workouts', workoutRoutes);

// Add route for posting workouts
app.post('/api/workouts', async (req, res) => {
  try {
    const { category, exercise, reps, sets, weight, date } = req.body;
    // Create a new workout object using the Workout model
    const newWorkout = new Workout({
      category,
      exercise,
      reps,
      sets,
      weight,
      date,
    });

    // Save the new workout to MongoDB
    await newWorkout.save();

    // Send back the saved workout as the response
    res.status(201).json(newWorkout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving workout', error });
  }
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
