const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true 
  },
  category: {
    type: String,
    required: true
  },
  exercise: {
    type: String,
    required: true
  },
  reps: {
    type: Number,
    required: true
  },
  sets: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
