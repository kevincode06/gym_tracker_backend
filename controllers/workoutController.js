// Controller function to format date 
const formatDateToYYYYMMDD = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0]; 
};

// Controller function to create a new workout entry
const createWorkout = async (req, res) => {
  try {
    const { name, category, exercise, reps, sets, weight, date } = req.body;

    // Validate required fields: name, category, and exercise
    if (!name || !category || !exercise) {
      return res.status(400).json({
        message: 'Name, category, and exercise are required',
        missingFields: { name: !name, category: !category, exercise: !exercise }
      });
    }

    // Create a new workout instance
    const newWorkout = new Workout({
      name: name.trim(),
      category,
      exercise,
      reps: Number(reps) || 0,
      sets: Number(sets) || 0,
      weight: Number(weight) || 0,
      date: date || new Date()
    });

    // Save the workout to the database
    await newWorkout.save();

    // Format date before sending it in the response
    const responseWorkout = newWorkout.toObject();
    responseWorkout.date = formatDateToYYYYMMDD(newWorkout.date);

    // Respond with the newly created workout
    res.status(201).json(responseWorkout);
  } catch (error) {
    console.error('Workout creation error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    // Handle generic error
    res.status(500).json({
      message: 'Error creating workout',
      error: error.message
    });
  }
};

// Controller function to get all workouts
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });

    // Format the date before sending it in the response
    const formattedWorkouts = workouts.map(workout => {
      const workoutObj = workout.toObject();
      workoutObj.date = formatDateToYYYYMMDD(workout.date);
      return workoutObj;
    });

    // Respond with the list of workouts
    res.status(200).json(formattedWorkouts);
  } catch (error) {
    console.error('Fetch workouts error:', error);
    res.status(500).json({
      message: 'Error fetching workouts',
      error: error.message
    });
  }
};

// Controller function to update an existing workout
const updateWorkout = async (req, res) => {
  try {
    const { name, category, exercise, reps, sets, weight, date } = req.body;

    // Validate required fields
    if (!name || !category || !exercise) {
      return res.status(400).json({
        message: 'Name, category, and exercise are required',
        missingFields: { name: !name, category: !category, exercise: !exercise }
      });
    }

    // Update the workout by its ID
    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        category,
        exercise,
        reps: Number(reps) || 0,
        sets: Number(sets) || 0,
        weight: Number(weight) || 0,
        date: date || new Date()
      },
      {
        new: true, // Return the updated document
        runValidators: true // Ensure validation is triggered
      }
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Format date before sending it in the response
    const responseWorkout = updatedWorkout.toObject();
    responseWorkout.date = formatDateToYYYYMMDD(updatedWorkout.date);

    res.status(200).json(responseWorkout);
  } catch (error) {
    console.error('Workout update error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      message: 'Error updating workout',
      error: error.message
    });
  }
};

// Controller function to delete a workout by ID
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Respond with success message
    res.status(200).json({
      message: 'Workout deleted successfully',
      deletedWorkout: workout
    });
  } catch (error) {
    console.error('Workout deletion error:', error);
    res.status(500).json({
      message: 'Error deleting workout',
      error: error.message
    });
  }
};

// Export all controller functions for use in routes
module.exports = { createWorkout, getWorkouts, updateWorkout, deleteWorkout };
