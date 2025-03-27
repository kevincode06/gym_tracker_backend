const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  exercise: {
    type: String,
    required: [true, 'Exercise is required']
  },
  reps: {
    type: Number,
    default: 0,
    min: [0, 'Reps cannot be negative']
  },
  sets: {
    type: Number,
    default: 0,
    min: [0, 'Sets cannot be negative']
  },
  weight: {
    type: Number,
    default: 0,
    min: [0, 'Weight cannot be negative']
  },
  date: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function(v) {
        return v instanceof Date;
      },
      message: 'Invalid date format'
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);

module.exports = Workout;