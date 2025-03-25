const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const exerciseRoutes = require('./routes/exerciseRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

dotenv.config();
connectDB();  // Connect to MongoDB

const app = express();
app.use(cors());
app.use(express.json());

app.use('/exercises', exerciseRoutes);
app.use('/workouts', workoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
