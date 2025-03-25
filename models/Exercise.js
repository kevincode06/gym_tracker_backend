const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  description: String,
});

module.exports = mongoose.model('Exercise', exerciseSchema);
