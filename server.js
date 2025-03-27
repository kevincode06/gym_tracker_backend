const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const exerciseRoutes = require('./routes/exerciseRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const Workout = require('./models/Workout'); // Import du modèle Workout

dotenv.config();
connectDB();  // Connexion à MongoDB

const app = express();
app.use(cors());
app.use(express.json());

// Définition des routes
app.use('/exercises', exerciseRoutes);
app.use('/workouts', workoutRoutes);

// Route pour ajouter un nouvel entraînement
app.post('/api/workouts', async (req, res) => {
  try {
    const { name, category, exercise, reps, sets, weight, date } = req.body;

    // Vérification que le champ "name" est bien présent
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

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur en cours d'exécution sur le port ${PORT}`));
