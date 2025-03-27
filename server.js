const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const exerciseRoutes = require('./routes/exerciseRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const Workout = require('./models/Workout'); 

dotenv.config();
connectDB();  

const app = express();
app.use(cors());
app.use(express.json());

app.use('/exercises', exerciseRoutes);
app.use('/workouts', workoutRoutes);

app.post('/api/workouts', async (req, res) => {
  try {
    const { name, category, exercise, reps, sets, weight, date } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Le champ "name" est obligatoire.' });
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
    console.error('Erreur lors de l\'enregistrement du workout:', error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement du workout', error });
  }
});

app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find(); 
    res.status(200).json(workouts);
  } catch (error) {
    console.error('Erreur lors de la récupération des workouts:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des workouts', error });
  }
});

app.delete('/api/workouts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedWorkout = await Workout.findByIdAndDelete(id);

    if (!deletedWorkout) {
      return res.status(404).json({ message: 'Workout non trouvé.' });
    }

    res.status(200).json({ message: 'Workout supprimé avec succès', deletedWorkout });
  } catch (error) {
    console.error('Erreur lors de la suppression du workout:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du workout', error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur en cours d'exécution sur le port ${PORT}`));
