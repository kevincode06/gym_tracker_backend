const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  exercise: { type: String, required: true },
  reps: { type: Number, required: true },
  sets: { type: Number, required: true },  // Ensure sets is stored as a Number
  weight: { type: Number, required: true },
  date: { type: String, required: true }
});

module.exports = mongoose.model('Workout', workoutSchema);
