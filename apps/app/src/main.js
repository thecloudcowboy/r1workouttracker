// Workout Tracker R1 Plugin
// Data Structure:
// - exercises: { id: {name, category, muscleGroup, type, instructions, imageUrl, videoUrl, isFavorite, isCustom, notes} }
// - categories: { id: {name, isCustom} }
// - workouts: { id: {date, exercises: [{exerciseId, sets: [{reps, weight, time, distance}], notes}], notes, duration} }
// - activeWorkout: current workout session

// ===========================================
// State Management
// ===========================================

const AppState = {
  currentScreen: 'home', // home, library, workout, history, reports, settings, exerciseDetail, addExercise, stopwatch
  exercises: {},
  categories: {},
  workouts: {},
  activeWorkout: null,
  favorites: new Set(),
  selectedCategory: null,
  selectedExercise: null,
  scrollPosition: 0,
  isLoading: false,
  stopwatch: {
    isRunning: false,
    startTime: null,
    elapsed: 0,
    laps: []
  }
};

// ===========================================
// Storage Functions
// ===========================================

async function saveToStorage(key, value) {
  if (window.creationStorage) {
    try {
      const encoded = btoa(JSON.stringify(value));
      await window.creationStorage.plain.setItem(key, encoded);
      console.log(`Saved ${key} to storage`);
    } catch (e) {
      console.error('Error saving to storage:', e);
    }
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

async function loadFromStorage(key) {
  if (window.creationStorage) {
    try {
      const stored = await window.creationStorage.plain.getItem(key);
      if (stored) {
        return JSON.parse(atob(stored));
      }
    } catch (e) {
      console.error('Error loading from storage:', e);
    }
  } else {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return null;
}

async function saveAppState() {
  await saveToStorage('exercises', AppState.exercises);
  await saveToStorage('categories', AppState.categories);
  await saveToStorage('workouts', AppState.workouts);
  await saveToStorage('favorites', Array.from(AppState.favorites));
}

async function saveActiveWorkout() {
  if (AppState.activeWorkout) {
    await saveToStorage('activeWorkout', AppState.activeWorkout);
  }
}

async function clearActiveWorkout() {
  if (window.creationStorage) {
    try {
      await window.creationStorage.plain.removeItem('activeWorkout');
    } catch (e) {
      console.error('Error clearing active workout:', e);
    }
  } else {
    localStorage.removeItem('activeWorkout');
  }
}

async function loadAppState() {
  const exercises = await loadFromStorage('exercises');
  const categories = await loadFromStorage('categories');
  const workouts = await loadFromStorage('workouts');
  const favorites = await loadFromStorage('favorites');
  const activeWorkout = await loadFromStorage('activeWorkout');
  
  if (exercises) AppState.exercises = exercises;
  if (categories) AppState.categories = categories;
  if (workouts) AppState.workouts = workouts;
  if (favorites) AppState.favorites = new Set(favorites);
  if (activeWorkout) AppState.activeWorkout = activeWorkout;
}

// ===========================================
// Initialize Predefined Data
// ===========================================

function initializePredefinedData() {
  // Only initialize if no data exists
  if (Object.keys(AppState.categories).length > 0) return;
  
  // Categories
  AppState.categories = {
    'chest': { id: 'chest', name: 'Chest', muscleGroup: 'Upper Body', isCustom: false },
    'back': { id: 'back', name: 'Back', muscleGroup: 'Upper Body', isCustom: false },
    'shoulders': { id: 'shoulders', name: 'Shoulders', muscleGroup: 'Upper Body', isCustom: false },
    'arms': { id: 'arms', name: 'Arms', muscleGroup: 'Upper Body', isCustom: false },
    'legs': { id: 'legs', name: 'Legs', muscleGroup: 'Lower Body', isCustom: false },
    'core': { id: 'core', name: 'Core', muscleGroup: 'Core', isCustom: false },
    'cardio': { id: 'cardio', name: 'Cardio', muscleGroup: 'Cardio', isCustom: false }
  };
  
  // Predefined Exercises - Expanded to 10-15 per category
  AppState.exercises = {
    // Chest (15 exercises)
    'bench-press': { id: 'bench-press', name: 'Bench Press', category: 'chest', type: 'Free Weights', instructions: 'Lie on bench, lower bar to chest, press up', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'incline-bench': { id: 'incline-bench', name: 'Incline Bench Press', category: 'chest', type: 'Free Weights', instructions: 'Press on incline bench targeting upper chest', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'decline-bench': { id: 'decline-bench', name: 'Decline Bench Press', category: 'chest', type: 'Free Weights', instructions: 'Press on decline bench targeting lower chest', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'dumbbell-press': { id: 'dumbbell-press', name: 'Dumbbell Press', category: 'chest', type: 'Free Weights', instructions: 'Press dumbbells from chest level upward', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'incline-dumbbell': { id: 'incline-dumbbell', name: 'Incline Dumbbell Press', category: 'chest', type: 'Free Weights', instructions: 'Press dumbbells on incline bench', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'chest-fly': { id: 'chest-fly', name: 'Chest Fly Machine', category: 'chest', type: 'Machine', instructions: 'Bring handles together in front of chest', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'dumbbell-fly': { id: 'dumbbell-fly', name: 'Dumbbell Fly', category: 'chest', type: 'Free Weights', instructions: 'Arc dumbbells from sides to center', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'cable-crossover': { id: 'cable-crossover', name: 'Cable Crossover', category: 'chest', type: 'Machine', instructions: 'Pull cables from high to low across body', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'pushup': { id: 'pushup', name: 'Push-ups', category: 'chest', type: 'Bodyweight', instructions: 'Lower body to ground, push back up', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'diamond-pushup': { id: 'diamond-pushup', name: 'Diamond Push-ups', category: 'chest', type: 'Bodyweight', instructions: 'Push-ups with hands forming diamond shape', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'wide-pushup': { id: 'wide-pushup', name: 'Wide Push-ups', category: 'chest', type: 'Bodyweight', instructions: 'Push-ups with hands wider than shoulders', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'chest-dip': { id: 'chest-dip', name: 'Chest Dips', category: 'chest', type: 'Bodyweight', instructions: 'Dips with body leaning forward', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'pec-deck': { id: 'pec-deck', name: 'Pec Deck', category: 'chest', type: 'Machine', instructions: 'Bring pads together using chest muscles', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'svend-press': { id: 'svend-press', name: 'Svend Press', category: 'chest', type: 'Free Weights', instructions: 'Press plates together and extend forward', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'landmine-press': { id: 'landmine-press', name: 'Landmine Press', category: 'chest', type: 'Free Weights', instructions: 'Press barbell from chest at angle', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    
    // Back (15 exercises)
    'deadlift': { id: 'deadlift', name: 'Deadlift', category: 'back', type: 'Free Weights', instructions: 'Lift bar from ground to hip level', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'romanian-deadlift': { id: 'romanian-deadlift', name: 'Romanian Deadlift', category: 'back', type: 'Free Weights', instructions: 'Hinge at hips, lower bar to shins', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'pullup': { id: 'pullup', name: 'Pull-ups', category: 'back', type: 'Bodyweight', instructions: 'Pull body up until chin over bar', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'chinup': { id: 'chinup', name: 'Chin-ups', category: 'back', type: 'Bodyweight', instructions: 'Pull-ups with underhand grip', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'lat-pulldown': { id: 'lat-pulldown', name: 'Lat Pulldown', category: 'back', type: 'Machine', instructions: 'Pull bar down to chest level', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'barbell-row': { id: 'barbell-row', name: 'Barbell Row', category: 'back', type: 'Free Weights', instructions: 'Pull bar to lower chest while bent over', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'dumbbell-row': { id: 'dumbbell-row', name: 'Dumbbell Row', category: 'back', type: 'Free Weights', instructions: 'Row dumbbell to hip while supported', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'seated-row': { id: 'seated-row', name: 'Seated Cable Row', category: 'back', type: 'Machine', instructions: 'Pull cable handles to torso', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    't-bar-row': { id: 't-bar-row', name: 'T-Bar Row', category: 'back', type: 'Machine', instructions: 'Row T-bar to chest in bent position', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'face-pull': { id: 'face-pull', name: 'Face Pulls', category: 'back', type: 'Machine', instructions: 'Pull rope to face level, elbows high', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'inverted-row': { id: 'inverted-row', name: 'Inverted Row', category: 'back', type: 'Bodyweight', instructions: 'Row body up to bar from underneath', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'hyperextension': { id: 'hyperextension', name: 'Hyperextensions', category: 'back', type: 'Bodyweight', instructions: 'Extend back from bent position', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'straight-arm-pulldown': { id: 'straight-arm-pulldown', name: 'Straight Arm Pulldown', category: 'back', type: 'Machine', instructions: 'Pull bar down with straight arms', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'shrug': { id: 'shrug', name: 'Shrugs', category: 'back', type: 'Free Weights', instructions: 'Raise shoulders toward ears with weight', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'rack-pull': { id: 'rack-pull', name: 'Rack Pulls', category: 'back', type: 'Free Weights', instructions: 'Deadlift from elevated position', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    
    // Shoulders (12 exercises)
    'shoulder-press': { id: 'shoulder-press', name: 'Shoulder Press', category: 'shoulders', type: 'Free Weights', instructions: 'Press weight overhead from shoulder level', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'military-press': { id: 'military-press', name: 'Military Press', category: 'shoulders', type: 'Free Weights', instructions: 'Strict overhead press with barbell', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'dumbbell-shoulder-press': { id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', category: 'shoulders', type: 'Free Weights', instructions: 'Press dumbbells overhead alternately or together', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'arnold-press': { id: 'arnold-press', name: 'Arnold Press', category: 'shoulders', type: 'Free Weights', instructions: 'Press with rotation from front to sides', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'lateral-raise': { id: 'lateral-raise', name: 'Lateral Raise', category: 'shoulders', type: 'Free Weights', instructions: 'Raise dumbbells to sides to shoulder height', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'front-raise': { id: 'front-raise', name: 'Front Raise', category: 'shoulders', type: 'Free Weights', instructions: 'Raise weight in front to shoulder height', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'rear-delt-fly': { id: 'rear-delt-fly', name: 'Rear Delt Fly', category: 'shoulders', type: 'Free Weights', instructions: 'Raise dumbbells to sides while bent over', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'upright-row': { id: 'upright-row', name: 'Upright Row', category: 'shoulders', type: 'Free Weights', instructions: 'Pull bar up along body to chin level', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'cable-lateral-raise': { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', category: 'shoulders', type: 'Machine', instructions: 'Raise cable handle to side', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'pike-pushup': { id: 'pike-pushup', name: 'Pike Push-ups', category: 'shoulders', type: 'Bodyweight', instructions: 'Push-ups with hips raised high', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'handstand-pushup': { id: 'handstand-pushup', name: 'Handstand Push-ups', category: 'shoulders', type: 'Bodyweight', instructions: 'Push-ups in handstand position', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'shoulder-shrug': { id: 'shoulder-shrug', name: 'Shoulder Shrugs', category: 'shoulders', type: 'Free Weights', instructions: 'Elevate shoulders with dumbbells', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    
    // Arms (15 exercises)
    'bicep-curl': { id: 'bicep-curl', name: 'Bicep Curl', category: 'arms', type: 'Free Weights', instructions: 'Curl weight up to shoulder level', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'hammer-curl': { id: 'hammer-curl', name: 'Hammer Curl', category: 'arms', type: 'Free Weights', instructions: 'Curl dumbbells with neutral grip', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'preacher-curl': { id: 'preacher-curl', name: 'Preacher Curl', category: 'arms', type: 'Free Weights', instructions: 'Curl on preacher bench for isolation', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'concentration-curl': { id: 'concentration-curl', name: 'Concentration Curl', category: 'arms', type: 'Free Weights', instructions: 'Curl dumbbell while seated, elbow on thigh', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'cable-curl': { id: 'cable-curl', name: 'Cable Curl', category: 'arms', type: 'Machine', instructions: 'Curl cable bar to shoulders', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'ez-bar-curl': { id: 'ez-bar-curl', name: 'EZ Bar Curl', category: 'arms', type: 'Free Weights', instructions: 'Curl EZ bar with angled grip', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'tricep-dip': { id: 'tricep-dip', name: 'Tricep Dips', category: 'arms', type: 'Bodyweight', instructions: 'Lower body by bending elbows, push back up', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'tricep-extension': { id: 'tricep-extension', name: 'Tricep Extension', category: 'arms', type: 'Free Weights', instructions: 'Extend arm overhead with weight', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'skull-crusher': { id: 'skull-crusher', name: 'Skull Crushers', category: 'arms', type: 'Free Weights', instructions: 'Lower bar to forehead, extend back up', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'tricep-pushdown': { id: 'tricep-pushdown', name: 'Tricep Pushdown', category: 'arms', type: 'Machine', instructions: 'Push cable bar down to full extension', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'close-grip-bench': { id: 'close-grip-bench', name: 'Close Grip Bench Press', category: 'arms', type: 'Free Weights', instructions: 'Bench press with narrow grip', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'overhead-extension': { id: 'overhead-extension', name: 'Overhead Tricep Extension', category: 'arms', type: 'Free Weights', instructions: 'Extend dumbbell overhead behind head', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'rope-pushdown': { id: 'rope-pushdown', name: 'Rope Pushdown', category: 'arms', type: 'Machine', instructions: 'Push rope down and apart', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'wrist-curl': { id: 'wrist-curl', name: 'Wrist Curls', category: 'arms', type: 'Free Weights', instructions: 'Curl wrists with forearms on bench', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'reverse-curl': { id: 'reverse-curl', name: 'Reverse Curl', category: 'arms', type: 'Free Weights', instructions: 'Curl with overhand grip', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    
    // Legs (15 exercises)
    'squat': { id: 'squat', name: 'Squat', category: 'legs', type: 'Free Weights', instructions: 'Lower hips until thighs parallel to ground', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'front-squat': { id: 'front-squat', name: 'Front Squat', category: 'legs', type: 'Free Weights', instructions: 'Squat with bar on front of shoulders', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'goblet-squat': { id: 'goblet-squat', name: 'Goblet Squat', category: 'legs', type: 'Free Weights', instructions: 'Squat holding dumbbell at chest', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'leg-press': { id: 'leg-press', name: 'Leg Press', category: 'legs', type: 'Machine', instructions: 'Push platform away with legs', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'leg-curl': { id: 'leg-curl', name: 'Leg Curl', category: 'legs', type: 'Machine', instructions: 'Curl legs up toward glutes', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'leg-extension': { id: 'leg-extension', name: 'Leg Extension', category: 'legs', type: 'Machine', instructions: 'Extend legs straight out', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'lunge': { id: 'lunge', name: 'Lunges', category: 'legs', type: 'Bodyweight', instructions: 'Step forward and lower back knee', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'walking-lunge': { id: 'walking-lunge', name: 'Walking Lunges', category: 'legs', type: 'Bodyweight', instructions: 'Lunge forward alternating legs', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'bulgarian-split-squat': { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', category: 'legs', type: 'Bodyweight', instructions: 'Single leg squat with rear foot elevated', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'calf-raise': { id: 'calf-raise', name: 'Calf Raises', category: 'legs', type: 'Bodyweight', instructions: 'Raise heels off ground', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'seated-calf-raise': { id: 'seated-calf-raise', name: 'Seated Calf Raise', category: 'legs', type: 'Machine', instructions: 'Raise heels while seated', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'hack-squat': { id: 'hack-squat', name: 'Hack Squat', category: 'legs', type: 'Machine', instructions: 'Squat on hack squat machine', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'step-up': { id: 'step-up', name: 'Step-ups', category: 'legs', type: 'Bodyweight', instructions: 'Step up onto elevated platform', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'glute-bridge': { id: 'glute-bridge', name: 'Glute Bridge', category: 'legs', type: 'Bodyweight', instructions: 'Raise hips off ground while on back', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'hip-thrust': { id: 'hip-thrust', name: 'Hip Thrust', category: 'legs', type: 'Free Weights', instructions: 'Thrust hips up with weight on lap', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    
    // Core (12 exercises)
    'plank': { id: 'plank', name: 'Plank', category: 'core', type: 'Bodyweight', instructions: 'Hold body straight in push-up position', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'side-plank': { id: 'side-plank', name: 'Side Plank', category: 'core', type: 'Bodyweight', instructions: 'Hold body sideways on one elbow', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'crunch': { id: 'crunch', name: 'Crunches', category: 'core', type: 'Bodyweight', instructions: 'Lift shoulders off ground toward knees', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'bicycle-crunch': { id: 'bicycle-crunch', name: 'Bicycle Crunches', category: 'core', type: 'Bodyweight', instructions: 'Crunch with alternating knee to elbow', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'russian-twist': { id: 'russian-twist', name: 'Russian Twist', category: 'core', type: 'Bodyweight', instructions: 'Rotate torso side to side while seated', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'leg-raise': { id: 'leg-raise', name: 'Leg Raises', category: 'core', type: 'Bodyweight', instructions: 'Raise legs while lying on back', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'hanging-leg-raise': { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', category: 'core', type: 'Bodyweight', instructions: 'Raise legs while hanging from bar', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'mountain-climber': { id: 'mountain-climber', name: 'Mountain Climbers', category: 'core', type: 'Bodyweight', instructions: 'Alternate bringing knees to chest in plank', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'ab-wheel': { id: 'ab-wheel', name: 'Ab Wheel Rollout', category: 'core', type: 'Bodyweight', instructions: 'Roll ab wheel forward and back', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'cable-crunch': { id: 'cable-crunch', name: 'Cable Crunch', category: 'core', type: 'Machine', instructions: 'Crunch down against cable resistance', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'wood-chop': { id: 'wood-chop', name: 'Wood Chops', category: 'core', type: 'Machine', instructions: 'Rotate and pull cable diagonally', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'dead-bug': { id: 'dead-bug', name: 'Dead Bug', category: 'core', type: 'Bodyweight', instructions: 'Alternate extending opposite arm and leg', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    
    // Cardio (10 exercises)
    'running': { id: 'running', name: 'Running', category: 'cardio', type: 'Cardio', instructions: 'Run at steady pace', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'treadmill': { id: 'treadmill', name: 'Treadmill', category: 'cardio', type: 'Machine', instructions: 'Run or walk on treadmill', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'cycling': { id: 'cycling', name: 'Cycling', category: 'cardio', type: 'Cardio', instructions: 'Cycle at steady pace', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'stationary-bike': { id: 'stationary-bike', name: 'Stationary Bike', category: 'cardio', type: 'Machine', instructions: 'Cycle on stationary bike', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'rowing': { id: 'rowing', name: 'Rowing Machine', category: 'cardio', type: 'Machine', instructions: 'Pull handle to chest, extend legs', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'jump-rope': { id: 'jump-rope', name: 'Jump Rope', category: 'cardio', type: 'Bodyweight', instructions: 'Jump over rope continuously', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'burpee': { id: 'burpee', name: 'Burpees', category: 'cardio', type: 'Bodyweight', instructions: 'Drop to plank, push up, jump up', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'elliptical': { id: 'elliptical', name: 'Elliptical', category: 'cardio', type: 'Machine', instructions: 'Use elliptical machine at steady pace', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'stair-climber': { id: 'stair-climber', name: 'Stair Climber', category: 'cardio', type: 'Machine', instructions: 'Climb stairs on machine', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' },
    'jumping-jack': { id: 'jumping-jack', name: 'Jumping Jacks', category: 'cardio', type: 'Bodyweight', instructions: 'Jump with arms and legs spreading', imageUrl: '', videoUrl: '', isFavorite: false, isCustom: false, notes: '' }
  };
  
  saveAppState();
}

// ===========================================
// Utility Functions
// ===========================================

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  } else if (mins > 0) {
    return `${mins}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

// ===========================================
// Navigation Functions
// ===========================================

function navigateTo(screen, data = {}) {
  AppState.currentScreen = screen;
  AppState.scrollPosition = 0;
  if (data.category) AppState.selectedCategory = data.category;
  if (data.exercise) AppState.selectedExercise = data.exercise;
  render();
}

// ===========================================
// Workout Functions
// ===========================================

function startWorkout() {
  AppState.activeWorkout = {
    id: generateId(),
    startTime: Date.now(),
    exercises: [],
    notes: ''
  };
  saveActiveWorkout();
  navigateTo('workout');
}

function addExerciseToWorkout(exerciseId) {
  if (!AppState.activeWorkout) return;
  
  AppState.activeWorkout.exercises.push({
    exerciseId: exerciseId,
    sets: [],
    notes: ''
  });
  saveAppState();
  saveActiveWorkout();
  render();
}

function addSetToExercise(exerciseIndex) {
  if (!AppState.activeWorkout) return;
  
  const exercise = AppState.activeWorkout.exercises[exerciseIndex];
  exercise.sets.push({
    reps: 0,
    weight: 0,
    time: 0,
    distance: 0,
    completed: false
  });
  saveAppState();
  saveActiveWorkout();
  render();
}

function updateSet(exerciseIndex, setIndex, field, value) {
  if (!AppState.activeWorkout) return;
  
  const set = AppState.activeWorkout.exercises[exerciseIndex].sets[setIndex];
  set[field] = value;
  
  // Immediate save without re-render to keep keyboard open
  saveAppState();
  saveActiveWorkout();
}

function finishWorkout() {
  if (!AppState.activeWorkout) return;
  
  AppState.activeWorkout.endTime = Date.now();
  AppState.activeWorkout.duration = Math.floor((AppState.activeWorkout.endTime - AppState.activeWorkout.startTime) / 1000);
  
  if (!AppState.workouts) AppState.workouts = {};
  AppState.workouts[AppState.activeWorkout.id] = AppState.activeWorkout;
  AppState.activeWorkout = null;
  
  saveAppState();
  clearActiveWorkout();
  navigateTo('home');
}

function cancelWorkout() {
  AppState.activeWorkout = null;
  clearActiveWorkout();
  navigateTo('home');
}

// ===========================================
// Exercise Management
// ===========================================

function toggleFavorite(exerciseId) {
  if (AppState.favorites.has(exerciseId)) {
    AppState.favorites.delete(exerciseId);
  } else {
    AppState.favorites.add(exerciseId);
  }
  
  if (AppState.exercises[exerciseId]) {
    AppState.exercises[exerciseId].isFavorite = AppState.favorites.has(exerciseId);
  }
  
  saveAppState();
  render();
}

function addCustomExercise(name, category, type, instructions) {
  const id = generateId();
  AppState.exercises[id] = {
    id: id,
    name: name,
    category: category,
    type: type,
    instructions: instructions,
    imageUrl: '',
    videoUrl: '',
    isFavorite: false,
    isCustom: true,
    notes: ''
  };
  saveAppState();
  navigateTo('library');
}

function addCustomCategory(name, muscleGroup) {
  const id = generateId();
  AppState.categories[id] = {
    id: id,
    name: name,
    muscleGroup: muscleGroup,
    isCustom: true
  };
  saveAppState();
  render();
}

function updateExerciseNotes(exerciseId, notes) {
  if (AppState.exercises[exerciseId]) {
    AppState.exercises[exerciseId].notes = notes;
    saveAppState();
  }
}

function updateWorkoutExerciseNotes(exerciseIndex, notes) {
  if (AppState.activeWorkout && AppState.activeWorkout.exercises[exerciseIndex]) {
    AppState.activeWorkout.exercises[exerciseIndex].notes = notes;
    saveAppState();
    saveActiveWorkout();
  }
}

// ===========================================
// Report Generation
// ===========================================

function generateWorkoutReport(workoutId) {
  const workout = AppState.workouts[workoutId];
  if (!workout) return '';
  
  let report = `WORKOUT REPORT\n`;
  report += `Date: ${formatDate(workout.startTime)}\n`;
  report += `Duration: ${formatTime(workout.duration)}\n`;
  report += `\n`;
  
  workout.exercises.forEach((we, idx) => {
    const exercise = AppState.exercises[we.exerciseId];
    if (!exercise) return;
    
    report += `${idx + 1}. ${exercise.name}\n`;
    we.sets.forEach((set, setIdx) => {
      report += `   Set ${setIdx + 1}: `;
      if (set.reps > 0) report += `${set.reps} reps `;
      if (set.weight > 0) report += `@ ${set.weight} lbs `;
      if (set.time > 0) report += `${set.time}s `;
      if (set.distance > 0) report += `${set.distance}m `;
      report += `\n`;
    });
    if (we.notes) report += `   Notes: ${we.notes}\n`;
    report += `\n`;
  });
  
  if (workout.notes) {
    report += `Workout Notes: ${workout.notes}\n`;
  }
  
  return report;
}

function generateProgressReport() {
  const workouts = Object.values(AppState.workouts).sort((a, b) => b.startTime - a.startTime);
  
  let report = `PROGRESS REPORT\n`;
  report += `Total Workouts: ${workouts.length}\n`;
  report += `\n`;
  
  // Exercise frequency
  const exerciseCount = {};
  workouts.forEach(workout => {
    workout.exercises.forEach(we => {
      const exercise = AppState.exercises[we.exerciseId];
      if (exercise) {
        exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
      }
    });
  });
  
  report += `Most Frequent Exercises:\n`;
  Object.entries(exerciseCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([name, count]) => {
      report += `- ${name}: ${count} times\n`;
    });
  
  report += `\n`;
  
  // Recent workouts
  report += `Recent Workouts:\n`;
  workouts.slice(0, 5).forEach(workout => {
    report += `- ${formatDate(workout.startTime)}: ${workout.exercises.length} exercises, ${formatTime(workout.duration)}\n`;
  });
  
  return report;
}

function exportReport(reportText) {
  if (typeof PluginMessageHandler !== 'undefined') {
    PluginMessageHandler.postMessage(JSON.stringify({
      message: `Please save this workout report:\n\n${reportText}`,
      wantsJournalEntry: true
    }));
  } else {
    console.log('Report:', reportText);
    alert('Report exported to console (journal entry in R1 device)');
  }
}

// ===========================================
// Image Search for Exercise Instructions
// ===========================================

function searchExerciseImage(exerciseName) {
  if (typeof PluginMessageHandler !== 'undefined') {
    const payload = {
      message: JSON.stringify({
        query_params: {
          engine: 'google_images',
          q: `${exerciseName} exercise demonstration`,
          hl: 'en',
          gl: 'us',
          tbs: 'sur:cl',
          ijn: 0,
          num: 1
        },
        useLocation: false
      }),
      useSerpAPI: true
    };
    PluginMessageHandler.postMessage(JSON.stringify(payload));
  }
}

window.onPluginMessage = function(data) {
  console.log('Received plugin message:', data);
  
  if (data.data) {
    try {
      const parsed = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
      
      // Handle image search results
      if (parsed.images_results && parsed.images_results.length > 0) {
        const imageUrl = parsed.images_results[0].thumbnail || parsed.images_results[0].original;
        if (AppState.selectedExercise && AppState.exercises[AppState.selectedExercise]) {
          AppState.exercises[AppState.selectedExercise].imageUrl = imageUrl;
          saveAppState();
          render();
        }
      }
    } catch (e) {
      console.error('Error parsing plugin message:', e);
    }
  }
};

// ===========================================
// Render Functions
// ===========================================

function render() {
  const app = document.getElementById('app');
  
  switch (AppState.currentScreen) {
    case 'home':
      renderHome(app);
      break;
    case 'library':
      renderLibrary(app);
      break;
    case 'workout':
      renderWorkout(app);
      break;
    case 'history':
      renderHistory(app);
      break;
    case 'reports':
      renderReports(app);
      break;
    case 'exerciseDetail':
      renderExerciseDetail(app);
      break;
    case 'addExercise':
      renderAddExercise(app);
      break;
    case 'addCategory':
      renderAddCategory(app);
      break;
    case 'favorites':
      renderFavorites(app);
      break;
    case 'stopwatch':
      renderStopwatch(app);
      break;
    default:
      renderHome(app);
  }
}

function renderHome(app) {
  app.innerHTML = `
    <div class="screen home-screen">
      <div class="home-screen-content">
        <h1>Workout Tracker</h1>
        
        <div class="menu-container">
          ${AppState.activeWorkout ? `
            <button class="menu-btn active-workout" data-action="continueWorkout">
              <span class="icon">▶</span>
              <span>Continue Workout</span>
            </button>
          ` : `
            <button class="menu-btn" data-action="startWorkout">
              <span class="icon">+</span>
              <span>Start Workout</span>
            </button>
          `}
          
          <button class="menu-btn" data-action="stopwatch">
            <span class="icon">⏱️</span>
            <span>Stopwatch</span>
          </button>
          
          <button class="menu-btn" data-action="library">
            <span class="icon">📚</span>
            <span>Exercise Library</span>
          </button>
          
          <button class="menu-btn" data-action="favorites">
            <span class="icon">⭐</span>
            <span>Favorites</span>
          </button>
          
          <button class="menu-btn" data-action="history">
            <span class="icon">📊</span>
            <span>History</span>
          </button>
          
          <button class="menu-btn" data-action="reports">
            <span class="icon">📄</span>
            <span>Reports</span>
          </button>
        </div>
        
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">${Object.keys(AppState.workouts).length}</div>
            <div class="stat-label">Total Workouts</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${Object.keys(AppState.exercises).length}</div>
            <div class="stat-label">Exercises</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  attachHomeHandlers();
}

function attachHomeHandlers() {
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.currentTarget.dataset.action;
      switch (action) {
        case 'startWorkout':
          startWorkout();
          break;
        case 'continueWorkout':
          navigateTo('workout');
          break;
        case 'stopwatch':
          navigateTo('stopwatch');
          break;
        case 'library':
          navigateTo('library');
          break;
        case 'favorites':
          navigateTo('favorites');
          break;
        case 'history':
          navigateTo('history');
          break;
        case 'reports':
          navigateTo('reports');
          break;
      }
    });
  });
}

function renderLibrary(app) {
  const categories = Object.values(AppState.categories);
  const exercises = Object.values(AppState.exercises);
  
  app.innerHTML = `
    <div class="screen library-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>Exercise Library</h2>
        <button class="add-btn" data-action="add">+</button>
      </div>
      
      <div class="library-toc">
        <div class="toc-title">Quick Navigation</div>
        <div class="toc-items">
          ${categories.map(cat => `
            <button class="toc-item" data-action="scrollToCategory" data-category="${cat.id}">
              ${cat.name}
            </button>
          `).join('')}
        </div>
      </div>
      
      <div class="scrollable-content" id="libraryContent">
        ${categories.map(cat => {
          const catExercises = exercises.filter(ex => ex.category === cat.id);
          return `
            <div class="category-section" id="category-${cat.id}">
              <div class="category-header">
                <h3>${cat.name}</h3>
                <span class="count">${catExercises.length}</span>
              </div>
              <div class="exercise-list">
                ${catExercises.map(ex => `
                  <div class="exercise-item" data-exercise="${ex.id}">
                    <div class="exercise-info">
                      <div class="exercise-name">${ex.name}</div>
                      <div class="exercise-type">${ex.type}</div>
                    </div>
                    <div class="exercise-actions">
                      <button class="fav-btn ${ex.isFavorite ? 'active' : ''}" data-action="favorite" data-id="${ex.id}">
                        ${ex.isFavorite ? '★' : '☆'}
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  
  attachLibraryHandlers();
}

function attachLibraryHandlers() {
  document.querySelector('[data-action="back"]')?.addEventListener('click', () => navigateTo('home'));
  document.querySelector('[data-action="add"]')?.addEventListener('click', () => navigateTo('addExercise'));
  
  document.querySelectorAll('[data-action="scrollToCategory"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const categoryId = btn.dataset.category;
      const categoryElement = document.getElementById(`category-${categoryId}`);
      if (categoryElement) {
        categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  document.querySelectorAll('.exercise-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.fav-btn')) return;
      navigateTo('exerciseDetail', { exercise: item.dataset.exercise });
    });
  });
  
  document.querySelectorAll('[data-action="favorite"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(btn.dataset.id);
    });
  });
}

function renderFavorites(app) {
  const favoriteExercises = Object.values(AppState.exercises).filter(ex => ex.isFavorite);
  const categoriesWithFavorites = {};
  
  favoriteExercises.forEach(ex => {
    if (!categoriesWithFavorites[ex.category]) {
      categoriesWithFavorites[ex.category] = [];
    }
    categoriesWithFavorites[ex.category].push(ex);
  });
  
  app.innerHTML = `
    <div class="screen favorites-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>Favorites</h2>
      </div>
      
      <div class="scrollable-content">
        ${Object.keys(categoriesWithFavorites).length === 0 ? `
          <div class="empty-state">
            <p>No favorite exercises yet</p>
            <p class="hint">Star exercises in the library to add them here</p>
          </div>
        ` : Object.entries(categoriesWithFavorites).map(([catId, exercises]) => {
          const category = AppState.categories[catId];
          return `
            <div class="category-section">
              <div class="category-header">
                <h3>${category.name}</h3>
                <span class="count">${exercises.length}</span>
              </div>
              <div class="exercise-list">
                ${exercises.map(ex => `
                  <div class="exercise-item" data-exercise="${ex.id}">
                    <div class="exercise-info">
                      <div class="exercise-name">${ex.name}</div>
                      <div class="exercise-type">${ex.type}</div>
                    </div>
                    <div class="exercise-actions">
                      <button class="fav-btn active" data-action="favorite" data-id="${ex.id}">★</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  
  attachFavoritesHandlers();
}

function attachFavoritesHandlers() {
  document.querySelector('[data-action="back"]')?.addEventListener('click', () => navigateTo('home'));
  
  document.querySelectorAll('.exercise-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.fav-btn')) return;
      navigateTo('exerciseDetail', { exercise: item.dataset.exercise });
    });
  });
  
  document.querySelectorAll('[data-action="favorite"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(btn.dataset.id);
    });
  });
}

function renderExerciseDetail(app) {
  const exercise = AppState.exercises[AppState.selectedExercise];
  if (!exercise) {
    navigateTo('library');
    return;
  }
  
  app.innerHTML = `
    <div class="screen exercise-detail-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>${exercise.name}</h2>
        <button class="fav-btn ${exercise.isFavorite ? 'active' : ''}" data-action="favorite">
          ${exercise.isFavorite ? '★' : '☆'}
        </button>
      </div>
      
      <div class="scrollable-content">
        <div class="exercise-detail-content">
          <div class="detail-section">
            <div class="label">Type</div>
            <div class="value">${exercise.type}</div>
          </div>
          
          <div class="detail-section">
            <div class="label">Category</div>
            <div class="value">${AppState.categories[exercise.category]?.name || 'Unknown'}</div>
          </div>
          
          <div class="detail-section">
            <div class="label">Instructions</div>
            <div class="value">${exercise.instructions}</div>
          </div>
          
          ${exercise.imageUrl ? `
            <div class="detail-section">
              <div class="label">Visual Guide</div>
              <img src="${exercise.imageUrl}" alt="${exercise.name}" class="exercise-image">
            </div>
          ` : `
            <button class="action-btn" data-action="searchImage">
              <span class="icon">🔍</span>
              <span>Search Exercise Image</span>
            </button>
          `}
          
          <div class="detail-section">
            <div class="label">Notes</div>
            <textarea class="notes-input" placeholder="Add personal notes..." data-action="updateNotes">${exercise.notes || ''}</textarea>
          </div>
          
          ${AppState.activeWorkout ? `
            <button class="action-btn primary" data-action="addToWorkout">
              <span class="icon">+</span>
              <span>Add to Current Workout</span>
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
  
  attachExerciseDetailHandlers();
}

function attachExerciseDetailHandlers() {
  document.querySelector('[data-action="back"]')?.addEventListener('click', () => navigateTo('library'));
  document.querySelector('[data-action="favorite"]')?.addEventListener('click', () => toggleFavorite(AppState.selectedExercise));
  document.querySelector('[data-action="searchImage"]')?.addEventListener('click', () => {
    const exercise = AppState.exercises[AppState.selectedExercise];
    searchExerciseImage(exercise.name);
  });
  document.querySelector('[data-action="addToWorkout"]')?.addEventListener('click', () => {
    addExerciseToWorkout(AppState.selectedExercise);
    navigateTo('workout');
  });
  
  const notesInput = document.querySelector('[data-action="updateNotes"]');
  if (notesInput) {
    notesInput.addEventListener('blur', () => {
      updateExerciseNotes(AppState.selectedExercise, notesInput.value);
    });
  }
}

function renderWorkout(app) {
  if (!AppState.activeWorkout) {
    navigateTo('home');
    return;
  }
  
  const elapsed = Math.floor((Date.now() - AppState.activeWorkout.startTime) / 1000);
  
  app.innerHTML = `
    <div class="screen workout-screen">
      <div class="header">
        <button class="back-btn" data-action="cancel">✕ Cancel</button>
        <h2>Active Workout</h2>
        <button class="finish-btn" data-action="finish">✓</button>
      </div>
      
      <div class="workout-timer">
        ${formatTime(elapsed)}
      </div>
      
      <div class="scrollable-content">
        ${AppState.activeWorkout.exercises.length === 0 ? `
          <div class="empty-state">
            <p>No exercises added yet</p>
            <button class="action-btn" data-action="addExercise">
              <span class="icon">+</span>
              <span>Add Exercise</span>
            </button>
          </div>
        ` : `
          <div class="workout-exercises">
            ${AppState.activeWorkout.exercises.map((we, idx) => {
              const exercise = AppState.exercises[we.exerciseId];
              if (!exercise) return '';
              
              return `
                <div class="workout-exercise-item">
                  <div class="workout-exercise-header">
                    <h3>${exercise.name}</h3>
                    <button class="icon-btn" data-action="removeExercise" data-index="${idx}">✕</button>
                  </div>
                  
                  <div class="sets-list">
                    ${we.sets.map((set, setIdx) => `
                      <div class="set-item">
                        <div class="set-header">
                          <div class="set-number">Set ${setIdx + 1}</div>
                          <button class="icon-btn small" data-action="removeSet" data-exercise="${idx}" data-set="${setIdx}">✕</button>
                        </div>
                        <div class="set-inputs">
                          <div class="set-input-row">
                            <span class="set-input-label">Reps:</span>
                            <input type="number" inputmode="decimal" placeholder="0" value="${set.reps || ''}" 
                                   data-action="updateSet" data-exercise="${idx}" data-set="${setIdx}" data-field="reps" 
                                   autocomplete="off">
                          </div>
                          <div class="set-input-row">
                            <span class="set-input-label">Weight:</span>
                            <input type="number" inputmode="decimal" placeholder="0" value="${set.weight || ''}" 
                                   data-action="updateSet" data-exercise="${idx}" data-set="${setIdx}" data-field="weight" 
                                   autocomplete="off">
                          </div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                  
                  <button class="action-btn small" data-action="addSet" data-exercise="${idx}">
                    <span class="icon">+</span>
                    <span>Add Set</span>
                  </button>
                  
                  <textarea class="notes-input small" placeholder="Exercise notes..." 
                            data-action="updateExerciseNotes" data-exercise="${idx}">${we.notes || ''}</textarea>
                </div>
              `;
            }).join('')}
          </div>
          
          <button class="action-btn" data-action="addExercise">
            <span class="icon">+</span>
            <span>Add Another Exercise</span>
          </button>
        `}
      </div>
    </div>
  `;
  
  attachWorkoutHandlers();
}

function attachWorkoutHandlers() {
  document.querySelector('[data-action="cancel"]')?.addEventListener('click', () => {
    if (confirm('Cancel workout? All progress will be lost.')) {
      cancelWorkout();
    }
  });
  
  document.querySelector('[data-action="finish"]')?.addEventListener('click', () => {
    if (AppState.activeWorkout.exercises.length === 0) {
      alert('Add at least one exercise before finishing');
      return;
    }
    finishWorkout();
  });
  
  document.querySelector('[data-action="addExercise"]')?.addEventListener('click', () => {
    navigateTo('library');
  });
  
  document.querySelectorAll('[data-action="addSet"]').forEach(btn => {
    btn.addEventListener('click', () => {
      addSetToExercise(parseInt(btn.dataset.exercise));
    });
  });
  
  document.querySelectorAll('[data-action="updateSet"]').forEach(input => {
    input.addEventListener('input', (e) => {
      const exerciseIdx = parseInt(e.target.dataset.exercise);
      const setIdx = parseInt(e.target.dataset.set);
      const field = e.target.dataset.field;
      const value = parseFloat(e.target.value) || 0;
      updateSet(exerciseIdx, setIdx, field, value);
    });
    
    // Prevent blur on input to keep keyboard open
    input.addEventListener('focus', (e) => {
      e.target.setAttribute('inputmode', 'decimal');
    });
  });
  
  document.querySelectorAll('[data-action="updateExerciseNotes"]').forEach(textarea => {
    textarea.addEventListener('blur', (e) => {
      const exerciseIdx = parseInt(e.target.dataset.exercise);
      updateWorkoutExerciseNotes(exerciseIdx, e.target.value);
    });
  });
  
  document.querySelectorAll('[data-action="removeExercise"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      AppState.activeWorkout.exercises.splice(idx, 1);
      saveAppState();
      saveActiveWorkout();
      render();
    });
  });
  
  document.querySelectorAll('[data-action="removeSet"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const exerciseIdx = parseInt(btn.dataset.exercise);
      const setIdx = parseInt(btn.dataset.set);
      AppState.activeWorkout.exercises[exerciseIdx].sets.splice(setIdx, 1);
      saveAppState();
      saveActiveWorkout();
      render();
    });
  });
}

function renderHistory(app) {
  const workouts = Object.values(AppState.workouts).sort((a, b) => b.startTime - a.startTime);
  
  app.innerHTML = `
    <div class="screen history-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>Workout History</h2>
      </div>
      
      <div class="scrollable-content">
        ${workouts.length === 0 ? `
          <div class="empty-state">
            <p>No workouts yet</p>
            <p class="hint">Start your first workout to see it here</p>
          </div>
        ` : `
          <div class="history-list">
            ${workouts.map(workout => `
              <div class="history-item" data-workout="${workout.id}">
                <div class="history-date">${formatDate(workout.startTime)}</div>
                <div class="history-info">
                  <div class="history-exercises">${workout.exercises.length} exercises</div>
                  <div class="history-duration">${formatTime(workout.duration)}</div>
                </div>
                <div class="history-preview">
                  ${workout.exercises.slice(0, 3).map(we => {
                    const ex = AppState.exercises[we.exerciseId];
                    return ex ? ex.name : 'Unknown';
                  }).join(', ')}
                  ${workout.exercises.length > 3 ? '...' : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;
  
  attachHistoryHandlers();
}

function attachHistoryHandlers() {
  document.querySelector('[data-action="back"]')?.addEventListener('click', () => navigateTo('home'));
  
  document.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', () => {
      const workoutId = item.dataset.workout;
      const report = generateWorkoutReport(workoutId);
      alert(report);
    });
  });
}

function renderReports(app) {
  app.innerHTML = `
    <div class="screen reports-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>Reports</h2>
      </div>
      
      <div class="scrollable-content">
        <div class="report-options">
          <button class="action-btn" data-action="progressReport">
            <span class="icon">📈</span>
            <span>Generate Progress Report</span>
          </button>
          
          <button class="action-btn" data-action="exportAll">
            <span class="icon">💾</span>
            <span>Export All Data</span>
          </button>
        </div>
        
        <div id="reportDisplay" class="report-display"></div>
      </div>
    </div>
  `;
  
  attachReportsHandlers();
}

function attachReportsHandlers() {
  document.querySelector('[data-action="back"]')?.addEventListener('click', () => navigateTo('home'));
  
  document.querySelector('[data-action="progressReport"]')?.addEventListener('click', () => {
    const report = generateProgressReport();
    const display = document.getElementById('reportDisplay');
    display.innerHTML = `
      <div class="report-content">
        <pre>${report}</pre>
        <button class="action-btn" data-action="export">Export to Journal</button>
      </div>
    `;
    
    display.querySelector('[data-action="export"]')?.addEventListener('click', () => {
      exportReport(report);
    });
  });
  
  document.querySelector('[data-action="exportAll"]')?.addEventListener('click', () => {
    const data = {
      exercises: AppState.exercises,
      categories: AppState.categories,
      workouts: AppState.workouts,
      favorites: Array.from(AppState.favorites)
    };
    const report = JSON.stringify(data, null, 2);
    exportReport(report);
  });
}

function renderAddExercise(app) {
  const categories = Object.values(AppState.categories);
  
  app.innerHTML = `
    <div class="screen add-exercise-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>Add Exercise</h2>
      </div>
      
      <div class="scrollable-content">
        <form class="add-form" id="addExerciseForm">
          <div class="form-group">
            <label>Exercise Name</label>
            <input type="text" name="name" placeholder="e.g., Dumbbell Curl" required>
          </div>
          
          <div class="form-group">
            <label>Category</label>
            <select name="category" required>
              <option value="">Select category</option>
              ${categories.map(cat => `
                <option value="${cat.id}">${cat.name}</option>
              `).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label>Type</label>
            <select name="type" required>
              <option value="">Select type</option>
              <option value="Free Weights">Free Weights</option>
              <option value="Machine">Machine</option>
              <option value="Bodyweight">Bodyweight</option>
              <option value="Cardio">Cardio</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Instructions</label>
            <textarea name="instructions" placeholder="How to perform this exercise" rows="4" required></textarea>
          </div>
          
          <button type="submit" class="action-btn primary">Add Exercise</button>
          <button type="button" class="action-btn" data-action="addCategory">+ Add New Category</button>
        </form>
      </div>
    </div>
  `;
  
  attachAddExerciseHandlers();
}

function attachAddExerciseHandlers() {
  document.querySelector('[data-action="back"]')?.addEventListener('click', () => navigateTo('library'));
  document.querySelector('[data-action="addCategory"]')?.addEventListener('click', () => navigateTo('addCategory'));
  
  document.getElementById('addExerciseForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    addCustomExercise(
      formData.get('name'),
      formData.get('category'),
      formData.get('type'),
      formData.get('instructions')
    );
  });
}

function renderAddCategory(app) {
  app.innerHTML = `
    <div class="screen add-category-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>Add Category</h2>
      </div>
      
      <div class="scrollable-content">
        <form class="add-form" id="addCategoryForm">
          <div class="form-group">
            <label>Category Name</label>
            <input type="text" name="name" placeholder="e.g., Abs" required>
          </div>
          
          <div class="form-group">
            <label>Muscle Group</label>
            <select name="muscleGroup" required>
              <option value="">Select muscle group</option>
              <option value="Upper Body">Upper Body</option>
              <option value="Lower Body">Lower Body</option>
              <option value="Core">Core</option>
              <option value="Full Body">Full Body</option>
              <option value="Cardio">Cardio</option>
            </select>
          </div>
          
          <button type="submit" class="action-btn primary">Add Category</button>
        </form>
      </div>
    </div>
  `;
  
  attachAddCategoryHandlers();
}

function attachAddCategoryHandlers() {
  document.querySelector('[data-action="back"]')?.addEventListener('click', () => navigateTo('addExercise'));
  
  document.getElementById('addCategoryForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    addCustomCategory(formData.get('name'), formData.get('muscleGroup'));
    navigateTo('addExercise');
  });
}

// ===========================================
// Stopwatch Functions
// ===========================================

function startStopwatch() {
  AppState.stopwatch.isRunning = true;
  AppState.stopwatch.startTime = Date.now() - AppState.stopwatch.elapsed;
}

function stopStopwatch() {
  AppState.stopwatch.isRunning = false;
  AppState.stopwatch.elapsed = Date.now() - AppState.stopwatch.startTime;
}

function resetStopwatch() {
  AppState.stopwatch.isRunning = false;
  AppState.stopwatch.startTime = null;
  AppState.stopwatch.elapsed = 0;
  AppState.stopwatch.laps = [];
}

function addLap() {
  const currentTime = AppState.stopwatch.isRunning 
    ? Date.now() - AppState.stopwatch.startTime 
    : AppState.stopwatch.elapsed;
  AppState.stopwatch.laps.push(currentTime);
}

function renderStopwatch(app) {
  const currentTime = AppState.stopwatch.isRunning 
    ? Date.now() - AppState.stopwatch.startTime 
    : AppState.stopwatch.elapsed;
  
  const ms = currentTime % 1000;
  const totalSeconds = Math.floor(currentTime / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  
  const timeDisplay = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${Math.floor(ms / 10).toString().padStart(2, '0')}`;
  
  app.innerHTML = `
    <div class="screen stopwatch-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>Stopwatch</h2>
        <button class="icon-btn" data-action="reset">↻</button>
      </div>
      
      <div class="stopwatch-display">
        <div class="stopwatch-time">${timeDisplay}</div>
        
        <div class="stopwatch-controls">
          ${AppState.stopwatch.isRunning ? `
            <button class="action-btn primary" data-action="stop">
              <span class="icon">⏸</span>
              <span>Stop</span>
            </button>
            <button class="action-btn" data-action="lap">
              <span class="icon">🏁</span>
              <span>Lap</span>
            </button>
          ` : `
            <button class="action-btn primary" data-action="start">
              <span class="icon">▶</span>
              <span>Start</span>
            </button>
            ${AppState.stopwatch.elapsed > 0 ? `
              <button class="action-btn" data-action="reset">
                <span class="icon">↻</span>
                <span>Reset</span>
              </button>
            ` : ''}
          `}
        </div>
      </div>
      
      ${AppState.stopwatch.laps.length > 0 ? `
        <div class="scrollable-content">
          <div class="laps-section">
            <h3>Laps</h3>
            <div class="laps-list">
              ${AppState.stopwatch.laps.map((lapTime, idx) => {
                const lapMs = lapTime % 1000;
                const lapTotalSeconds = Math.floor(lapTime / 1000);
                const lapSeconds = lapTotalSeconds % 60;
                const lapMinutes = Math.floor(lapTotalSeconds / 60) % 60;
                const lapHours = Math.floor(lapTotalSeconds / 3600);
                const lapDisplay = `${lapHours.toString().padStart(2, '0')}:${lapMinutes.toString().padStart(2, '0')}:${lapSeconds.toString().padStart(2, '0')}.${Math.floor(lapMs / 10).toString().padStart(2, '0')}`;
                
                return `
                  <div class="lap-item">
                    <span class="lap-number">Lap ${idx + 1}</span>
                    <span class="lap-time">${lapDisplay}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
  
  attachStopwatchHandlers();
}

function attachStopwatchHandlers() {
  document.querySelector('[data-action="back"]')?.addEventListener('click', () => navigateTo('home'));
  document.querySelector('[data-action="start"]')?.addEventListener('click', () => {
    startStopwatch();
    render();
  });
  document.querySelector('[data-action="stop"]')?.addEventListener('click', () => {
    stopStopwatch();
    render();
  });
  document.querySelectorAll('[data-action="reset"]').forEach(btn => {
    btn.addEventListener('click', () => {
      resetStopwatch();
      render();
    });
  });
  document.querySelector('[data-action="lap"]')?.addEventListener('click', () => {
    addLap();
    render();
  });
}

// ===========================================
// Hardware Event Handlers
// ===========================================

window.addEventListener('scrollUp', () => {
  console.log('Scroll up detected');
});

window.addEventListener('scrollDown', () => {
  console.log('Scroll down detected');
});

window.addEventListener('sideClick', () => {
  console.log('Side button clicked');
  
  // Context-aware side button actions
  if (AppState.currentScreen === 'home' && !AppState.activeWorkout) {
    startWorkout();
  } else if (AppState.currentScreen === 'workout') {
    // Quick add set to last exercise
    if (AppState.activeWorkout && AppState.activeWorkout.exercises.length > 0) {
      const lastExerciseIdx = AppState.activeWorkout.exercises.length - 1;
      addSetToExercise(lastExerciseIdx);
    }
  } else if (AppState.currentScreen === 'stopwatch') {
    // Toggle stopwatch start/stop
    if (AppState.stopwatch.isRunning) {
      stopStopwatch();
    } else {
      startStopwatch();
    }
    render();
  }
});

// ===========================================
// Initialization
// ===========================================

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Workout Tracker initialized');
  
  // Keyboard fallback for development
  if (typeof PluginMessageHandler === 'undefined') {
    window.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('sideClick'));
      }
    });
  }
  
  // Load saved data
  await loadAppState();
  
  // Initialize predefined data if needed
  initializePredefinedData();
  
  // Initial render
  render();
  
  // Update timer every second for active workouts
  setInterval(() => {
    if (AppState.activeWorkout && AppState.currentScreen === 'workout') {
      const timerEl = document.querySelector('.workout-timer');
      if (timerEl) {
        const elapsed = Math.floor((Date.now() - AppState.activeWorkout.startTime) / 1000);
        timerEl.textContent = formatTime(elapsed);
      }
    }
    
    // Update stopwatch display
    if (AppState.stopwatch.isRunning && AppState.currentScreen === 'stopwatch') {
      render();
    }
  }, 100);
  
  // Auto-save state periodically
  setInterval(async () => {
    await saveAppState();
    if (AppState.activeWorkout) {
      await saveActiveWorkout();
    }
  }, 10000); // Save every 10 seconds
  
  // Save on page unload/close
  window.addEventListener('beforeunload', async () => {
    await saveAppState();
    if (AppState.activeWorkout) {
      await saveActiveWorkout();
    }
  });
  
  // Save on visibility change (app going to background)
  document.addEventListener('visibilitychange', async () => {
    if (document.hidden) {
      await saveAppState();
      if (AppState.activeWorkout) {
        await saveActiveWorkout();
      }
    }
  });
});
