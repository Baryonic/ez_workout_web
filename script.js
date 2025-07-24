let currentSessionIndex = null;
let currentExerciseIndex = 0;
let timerInterval = null;

// --- Global Scope Data ---
// These are declared globally so they can be accessed by the inline onclick functions.
let exercises = [];
let sessions = [];
let workoutLog = [];
let favoriteExercises = [];
let favoriteSessions = [];
let newSessionExercises = [];
let muscles = [];

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const sidebar = document.querySelector('.sidebar');
    const homeBtn = document.getElementById('home-btn');
    const viewExercisesBtn = document.getElementById('view-exercises-btn');
    const viewSessionsBtn = document.getElementById('view-sessions-btn');
    const createSessionBtn = document.getElementById('create-session-btn');
    const viewLogBtn = document.getElementById('view-log-btn');
    const loadDefaultsBtn = document.getElementById('load-defaults-btn');
    const searchBar = document.getElementById('search-bar');
    const searchBtn = document.getElementById('search-btn');
    const sidebarToggleDesktop = document.getElementById('sidebar-toggle-desktop');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');

    const defaultMuscles = [
      {
        "id": 1,
        "name": "Pectoralis Major",
        "image_url": "muscles_images/Pectoralis Major.svg"
      },
      {
        "id": 2,
        "name": "Anterior Deltoids",
        "image_url": "muscles_images/Anterior Deltoids.svg"
      },
      {
        "id": 3,
        "name": "Triceps Brachii",
        "image_url": "muscles_images/Triceps Brachii.svg"
      },
      {
        "id": 4,
        "name": "Quadriceps",
        "image_url": "muscles_images/Quadriceps.svg"
      },
      {
        "id": 5,
        "name": "Hamstrings",
        "image_url": "muscles_images/Hamstrings.svg"
      },
      {
        "id": 6,
        "name": "Glutes",
        "image_url": "muscles_images/Glutes.svg"
      },
      {
        "id": 7,
        "name": "Rectus Abdominis",
        "image_url": "muscles_images/Rectus Abdominis.svg"
      },
      {
        "id": 8,
        "name": "Obliques",
        "image_url": "muscles_images/Obliques.svg"
      },
      {
        "id": 9,
        "name": "Erector Spinae",
        "image_url": "muscles_images/Erector Spinae.svg"
      },
      {
        "id": 10,
        "name": "Latissimus Dorsi",
        "image_url": "muscles_images/Latissimus Dorsi.svg"
      },
      {
        "id": 11,
        "name": "Biceps Brachii",
        "image_url": "muscles_images/biceps_brachii.png"
      },
      {
        "id": 12,
        "name": "Trapezius",
        "image_url": "muscles_images/trapezius.png"
      },
      {
        "id": 13,
        "name": "Rhomboids",
        "image_url": "muscles_images/rhomboids.png"
      },
      {
        "id": 14,
        "name": "Lateral Deltoids",
        "image_url": "muscles_images/lateral_deltoids.png"
      },
      {
        "id": 15,
        "name": "Posterior Deltoids",
        "image_url": "muscles_images/posterior_deltoids.png"
      },
      {
        "id": 16,
        "name": "Gastrocnemius",
        "image_url": "muscles_images/gastrocnemius.png"
      },
      {
        "id": 17,
        "name": "Soleus",
        "image_url": "muscles_images/soleus.png"
      },
      {
        "id": 18,
        "name": "Brachialis",
        "image_url": "muscles_images/brachialis.png"
      },
      {
        "id": 19,
        "name": "Brachioradialis",
        "image_url": "muscles_images/brachioradialis.png"
      },
      {
        "id": 20,
        "name": "Cardio",
        "image_url": "muscles_images/cardio.png"
      },
      {
        "id": 21,
        "name": "Full Body",
        "image_url": "muscles_images/full_body.png"
      }
    ];

    const defaultExercises = [
      {
        "id": 1,
        "name": "Push-up",
        "description": "A classic bodyweight exercise that works the chest, shoulders, and triceps.",
        "muscles": ["Pectoralis Major", "Anterior Deltoids", "Triceps Brachii"],
        "muscle_ids": [1, 2, 3]
      },
      {
        "id": 2,
        "name": "Squat",
        "description": "A fundamental lower body exercise that targets the quadriceps, hamstrings, and glutes.",
        "muscles": ["Quadriceps", "Hamstrings", "Glutes"],
        "muscle_ids": [4, 5, 6]
      },
      {
        "id": 3,
        "name": "Plank",
        "description": "An isometric core strength exercise that involves maintaining a position similar to a push-up for the maximum possible time.",
        "muscles": ["Rectus Abdominis", "Obliques", "Erector Spinae"],
        "muscle_ids": [7, 8, 9]
      },
      {
        "id": 4,
        "name": "Jumping Jacks",
        "description": "A full-body exercise that can be done as a warm-up.",
        "muscles": ["Full Body", "Cardio"],
        "muscle_ids": [21, 20]
      },
      {
        "id": 5,
        "name": "Bench Press",
        "description": "A compound exercise that targets the chest, shoulders, and triceps.",
        "muscles": ["Pectoralis Major", "Anterior Deltoids", "Triceps Brachii"],
        "muscle_ids": [1, 2, 3]
      },
      {
        "id": 6,
        "name": "Incline Bench Press",
        "description": "A variation of the bench press that emphasizes the upper chest.",
        "muscles": ["Pectoralis Major", "Anterior Deltoids"],
        "muscle_ids": [1, 2]
      },
      {
        "id": 7,
        "name": "Dips",
        "description": "A bodyweight exercise that primarily works the triceps and chest.",
        "muscles": ["Triceps Brachii", "Pectoralis Major", "Anterior Deltoids"],
        "muscle_ids": [3, 1, 2]
      },
      {
        "id": 8,
        "name": "Cable Flys",
        "description": "An isolation exercise that targets the chest muscles.",
        "muscles": ["Pectoralis Major"],
        "muscle_ids": [1]
      },
      {
        "id": 9,
        "name": "Pec Deck Machine",
        "description": "A machine-based isolation exercise for the chest.",
        "muscles": ["Pectoralis Major"],
        "muscle_ids": [1]
      },
      {
        "id": 10,
        "name": "Dumbbell Pullover",
        "description": "An exercise that works the chest and back.",
        "muscles": ["Pectoralis Major", "Latissimus Dorsi"],
        "muscle_ids": [1, 10]
      },
      {
        "id": 11,
        "name": "Pull-Ups",
        "description": "A challenging bodyweight exercise that targets the back and biceps.",
        "muscles": ["Latissimus Dorsi", "Biceps Brachii"],
        "muscle_ids": [10, 11]
      },
      {
        "id": 12,
        "name": "Chin-Ups",
        "description": "Similar to pull-ups, but with a closer grip, emphasizing the biceps.",
        "muscles": ["Latissimus Dorsi", "Biceps Brachii"],
        "muscle_ids": [10, 11]
      },
      {
        "id": 13,
        "name": "Barbell Bent-Over Rows",
        "description": "A compound exercise for building a strong and thick back.",
        "muscles": ["Latissimus Dorsi", "Biceps Brachii", "Rhomboids", "Trapezius"],
        "muscle_ids": [10, 11, 13, 12]
      },
      {
        "id": 14,
        "name": "Deadlifts",
        "description": "A full-body compound exercise that develops overall strength.",
        "muscles": ["Erector Spinae", "Hamstrings", "Glutes", "Quadriceps", "Trapezius"],
        "muscle_ids": [9, 5, 6, 4, 12]
      },
      {
        "id": 15,
        "name": "T-Bar Rows",
        "description": "A variation of the row that targets the middle back.",
        "muscles": ["Latissimus Dorsi", "Rhomboids"],
        "muscle_ids": [10, 13]
      },
      {
        "id": 16,
        "name": "Seated Cable Rows",
        "description": "A machine-based exercise for targeting the back muscles.",
        "muscles": ["Latissimus Dorsi", "Rhomboids"],
        "muscle_ids": [10, 13]
      },
      {
        "id": 17,
        "name": "Lat Pulldowns",
        "description": "A machine exercise that mimics the pull-up motion.",
        "muscles": ["Latissimus Dorsi"],
        "muscle_ids": [10]
      },
      {
        "id": 18,
        "name": "Reverse Flys",
        "description": "An isolation exercise for the rear deltoids and upper back.",
        "muscles": ["Posterior Deltoids", "Rhomboids"],
        "muscle_ids": [15, 13]
      },
      {
        "id": 19,
        "name": "Overhead Press",
        "description": "A compound shoulder exercise that builds strength and size.",
        "muscles": ["Anterior Deltoids", "Lateral Deltoids", "Triceps Brachii"],
        "muscle_ids": [2, 14, 3]
      },
      {
        "id": 20,
        "name": "Arnold Press",
        "description": "A dumbbell shoulder press variation that targets all three heads of the deltoid.",
        "muscles": ["Anterior Deltoids", "Lateral Deltoids", "Posterior Deltoids"],
        "muscle_ids": [2, 14, 15]
      },
      {
        "id": 21,
        "name": "Lateral Raises",
        "description": "An isolation exercise for the side deltoids.",
        "muscles": ["Lateral Deltoids"],
        "muscle_ids": [14]
      },
      {
        "id": 22,
        "name": "Front Raises",
        "description": "An isolation exercise for the front deltoids.",
        "muscles": ["Anterior Deltoids"],
        "muscle_ids": [2]
      },
      {
        "id": 23,
        "name": "Upright Rows",
        "description": "A compound exercise that targets the shoulders and traps.",
        "muscles": ["Lateral Deltoids", "Trapezius"],
        "muscle_ids": [14, 12]
      },
      {
        "id": 24,
        "name": "Face Pulls",
        "description": "An exercise that improves shoulder health and posture.",
        "muscles": ["Posterior Deltoids", "Rhomboids"],
        "muscle_ids": [15, 13]
      },
      {
        "id": 25,
        "name": "Leg Press",
        "description": "A machine-based compound exercise for the legs.",
        "muscles": ["Quadriceps", "Hamstrings", "Glutes"],
        "muscle_ids": [4, 5, 6]
      },
      {
        "id": 26,
        "name": "Lunges",
        "description": "A unilateral leg exercise that improves balance and strength.",
        "muscles": ["Quadriceps", "Hamstrings", "Glutes"],
        "muscle_ids": [4, 5, 6]
      },
      {
        "id": 27,
        "name": "Leg Extensions",
        "description": "An isolation exercise for the quadriceps.",
        "muscles": ["Quadriceps"],
        "muscle_ids": [4]
      },
      {
        "id": 28,
        "name": "Romanian Deadlifts",
        "description": "A deadlift variation that emphasizes the hamstrings and glutes.",
        "muscles": ["Hamstrings", "Glutes"],
        "muscle_ids": [5, 6]
      },
      {
        "id": 29,
        "name": "Stiff-Legged Deadlifts",
        "description": "Similar to the Romanian deadlift, but with a greater emphasis on the hamstrings.",
        "muscles": ["Hamstrings"],
        "muscle_ids": [5]
      },
      {
        "id": 30,
        "name": "Hamstring Curls",
        "description": "An isolation exercise for the hamstrings.",
        "muscles": ["Hamstrings"],
        "muscle_ids": [5]
      },
      {
        "id": 31,
        "name": "Good Mornings",
        "description": "A hip-hinge exercise that strengthens the hamstrings and lower back.",
        "muscles": ["Hamstrings", "Glutes", "Erector Spinae"],
        "muscle_ids": [5, 6, 9]
      },
      {
        "id": 32,
        "name": "Hip Thrusts",
        "description": "An exercise that isolates and builds the glute muscles.",
        "muscles": ["Glutes"],
        "muscle_ids": [6]
      },
      {
        "id": 33,
        "name": "Glute Bridges",
        "description": "A bodyweight exercise for activating and strengthening the glutes.",
        "muscles": ["Glutes"],
        "muscle_ids": [6]
      },
      {
        "id": 34,
        "name": "Bulgarian Split Squats",
        "description": "A single-leg squat variation that challenges balance and strength.",
        "muscles": ["Quadriceps", "Glutes"],
        "muscle_ids": [4, 6]
      },
      {
        "id": 35,
        "name": "Cable Kickbacks",
        "description": "An isolation exercise for the glutes using a cable machine.",
        "muscles": ["Glutes"],
        "muscle_ids": [6]
      },
      {
        "id": 36,
        "name": "Calf Raises",
        "description": "An isolation exercise for the calf muscles.",
        "muscles": ["Gastrocnemius", "Soleus"],
        "muscle_ids": [16, 17]
      },
      {
        "id": 37,
        "name": "Jump Rope",
        "description": "A cardiovascular exercise that also works the calves.",
        "muscles": ["Gastrocnemius", "Soleus", "Cardio"],
        "muscle_ids": [16, 17, 20]
      },
      {
        "id": 38,
        "name": "Barbell Curls",
        "description": "A classic biceps exercise for building mass.",
        "muscles": ["Biceps Brachii"],
        "muscle_ids": [11]
      },
      {
        "id": 39,
        "name": "Dumbbell Curls",
        "description": "A versatile biceps exercise that can be done standing or seated.",
        "muscles": ["Biceps Brachii"],
        "muscle_ids": [11]
      },
      {
        "id": 40,
        "name": "Hammer Curls",
        "description": "A curl variation that targets the biceps and brachialis.",
        "muscles": ["Biceps Brachii", "Brachialis"],
        "muscle_ids": [11, 18]
      },
      {
        "id": 41,
        "name": "Preacher Curls",
        "description": "An isolation exercise that prevents cheating and maximizes biceps contraction.",
        "muscles": ["Biceps Brachii"],
        "muscle_ids": [11]
      },
      {
        "id": 42,
        "name": "Close-Grip Bench Press",
        "description": "A bench press variation that emphasizes the triceps.",
        "muscles": ["Triceps Brachii", "Pectoralis Major"],
        "muscle_ids": [3, 1]
      },
      {
        "id": 43,
        "name": "Triceps Pushdowns",
        "description": "An isolation exercise for the triceps using a cable machine.",
        "muscles": ["Triceps Brachii"],
        "muscle_ids": [3]
      },
      {
        "id": 44,
        "name": "Overhead Triceps Extensions",
        "description": "An exercise that targets the long head of the triceps.",
        "muscles": ["Triceps Brachii"],
        "muscle_ids": [3]
      },
      {
        "id": 45,
        "name": "Crunches",
        "description": "A classic abdominal exercise that targets the rectus abdominis.",
        "muscles": ["Rectus Abdominis"],
        "muscle_ids": [7]
      },
      {
        "id": 46,
        "name": "Leg Raises",
        "description": "An exercise that targets the lower abdominals.",
        "muscles": ["Rectus Abdominis"],
        "muscle_ids": [7]
      },
      {
        "id": 47,
        "name": "Russian Twists",
        "description": "An exercise that targets the obliques.",
        "muscles": ["Rectus Abdominis", "Obliques"],
        "muscle_ids": [7, 8]
      },
      {
        "id": 48,
        "name": "Side Plank",
        "description": "An isometric exercise that strengthens the obliques.",
        "muscles": ["Obliques"],
        "muscle_ids": [8]
      },
      {
        "id": 49,
        "name": "Bicycle Crunches",
        "description": "A dynamic exercise that works the abs and obliques.",
        "muscles": ["Rectus Abdominis", "Obliques"],
        "muscle_ids": [7, 8]
      },
      {
        "id": 50,
        "name": "Wood Chops",
        "description": "A functional exercise that mimics a chopping motion and works the core.",
        "muscles": ["Rectus Abdominis", "Obliques"],
        "muscle_ids": [7, 8]
      }
    ];
    const defaultSessions = [
      {
        "name": "Full Body Blast",
        "exercises": [
          {
            "exercise_id": 4,
            "duration_seconds": 60
          },
          {
            "exercise_id": 2,
            "reps": 15,
            "sets": 3
          },
          {
            "exercise_id": 1,
            "reps": 10,
            "sets": 3
          },
          {
            "exercise_id": 3,
            "duration_seconds": 45,
            "sets": 3
          }
        ]
      },
      {
        "name": "Beginner Full Body A",
        "exercises": [
          {
            "exercise_id": 2,
            "reps": 12,
            "sets": 3
          },
          {
            "exercise_id": 5,
            "reps": 12,
            "sets": 3
          },
          {
            "exercise_id": 11,
            "reps": 12,
            "sets": 3
          },
          {
            "exercise_id": 19,
            "reps": 12,
            "sets": 3
          },
          {
            "exercise_id": 13,
            "reps": 12,
            "sets": 3
          }
        ]
      },
      {
        "name": "Beginner Full Body B",
        "exercises": [
          {
            "exercise_id": 28,
            "reps": 12,
            "sets": 3
          },
          {
            "exercise_id": 13,
            "reps": 12,
            "sets": 3
          },
          {
            "exercise_id": 6,
            "reps": 12,
            "sets": 3
          },
          {
            "exercise_id": 17,
            "reps": 12,
            "sets": 3
          },
          {
            "exercise_id": 26,
            "reps": 12,
            "sets": 3
          }
        ]
      },
      {
        "name": "Intermediate Full Body A",
        "exercises": [
          {
            "exercise_id": 2,
            "reps": 8,
            "sets": 3
          },
          {
            "exercise_id": 5,
            "reps": 8,
            "sets": 3
          },
          {
            "exercise_id": 11,
            "reps": 10,
            "sets": 3
          },
          {
            "exercise_id": 19,
            "reps": 10,
            "sets": 3
          },
          {
            "exercise_id": 30,
            "reps": 10,
            "sets": 3
          },
          {
            "exercise_id": 39,
            "reps": 15,
            "sets": 3
          },
          {
            "exercise_id": 24,
            "reps": 15,
            "sets": 3
          }
        ]
      },
      {
        "name": "Intermediate Full Body B",
        "exercises": [
          {
            "exercise_id": 28,
            "reps": 10,
            "sets": 3
          },
          {
            "exercise_id": 16,
            "reps": 10,
            "sets": 3
          },
          {
            "exercise_id": 6,
            "reps": 10,
            "sets": 3
          },
          {
            "exercise_id": 25,
            "reps": 12,
            "sets": 3
          },
          {
            "exercise_id": 21,
            "reps": 15,
            "sets": 3
          },
          {
            "exercise_id": 43,
            "reps": 15,
            "sets": 3
          },
          {
            "exercise_id": 36,
            "reps": 15,
            "sets": 3
          }
        ]
      },
      {
        "name": "Advanced Full Body 1",
        "exercises": [
          {
            "exercise_id": 2,
            "reps": 5,
            "sets": 4
          },
          {
            "exercise_id": 11,
            "reps": 8,
            "sets": 4
          },
          {
            "exercise_id": 19,
            "reps": 6,
            "sets": 3
          },
          {
            "exercise_id": 32,
            "reps": 8,
            "sets": 3
          },
          {
            "exercise_id": 46,
            "reps": 12,
            "sets": 3
          }
        ]
      },
      {
        "name": "Advanced Full Body 2",
        "exercises": [
          {
            "exercise_id": 28,
            "reps": 8,
            "sets": 4
          },
          {
            "exercise_id": 6,
            "reps": 10,
            "sets": 4
          },
          {
            "exercise_id": 34,
            "reps": 10,
            "sets": 3
          },
          {
            "exercise_id": 15,
            "reps": 10,
            "sets": 4
          },
          {
            "exercise_id": 1,
            "reps": 20,
            "sets": 3
          }
        ]
      },
      {
        "name": "Advanced Full Body 3",
        "exercises": [
          {
            "exercise_id": 37,
            "duration_seconds": 300
          },
          {
            "exercise_id": 14,
            "reps": 10,
            "sets": 4
          },
          {
            "exercise_id": 7,
            "reps": 12,
            "sets": 4
          },
          {
            "exercise_id": 26,
            "reps": 20,
            "sets": 3
          },
          {
            "exercise_id": 3,
            "duration_seconds": 60,
            "sets": 3
          }
        ]
      },
      {
        "name": "Push Day",
        "exercises": [
          {
            "exercise_id": 5,
            "reps": 8,
            "sets": 4
          },
          {
            "exercise_id": 6,
            "reps": 10,
            "sets": 3
          },
          {
            "exercise_id": 19,
            "reps": 8,
            "sets": 4
          },
          {
            "exercise_id": 21,
            "reps": 12,
            "sets": 3
          },
          {
            "exercise_id": 43,
            "reps": 12,
            "sets": 3
          },
          {
            "exercise_id": 44,
            "reps": 12,
            "sets": 3
          }
        ]
      },
      {
        "name": "Pull Day",
        "exercises": [
          {
            "exercise_id": 11,
            "reps": 8,
            "sets": 4
          },
          {
            "exercise_id": 13,
            "reps": 10,
            "sets": 3
          },
          {
            "exercise_id": 17,
            "reps": 12,
            "sets": 3
          },
          {
            "exercise_id": 18,
            "reps": 15,
            "sets": 3
          },
          {
            "exercise_id": 38,
            "reps": 12,
            "sets": 3
          },
          {
            "exercise_id": 40,
            "reps": 12,
            "sets": 3
          }
        ]
      },
      {
        "name": "Leg Day",
        "exercises": [
          {
            "exercise_id": 2,
            "reps": 8,
            "sets": 4
          },
          {
            "exercise_id": 25,
            "reps": 10,
            "sets": 3
          },
          {
            "exercise_id": 28,
            "reps": 10,
            "sets": 3
          },
          {
            "exercise_id": 30,
            "reps": 12,
            "sets": 3
          },
          {
            "exercise_id": 36,
            "reps": 15,
            "sets": 4
          }
        ]
      },
      {
        "name": "Upper Body",
        "exercises": [
          {
            "exercise_id": 5,
            "reps": 8,
            "sets": 3
          },
          {
            "exercise_id": 11,
            "reps": 8,
            "sets": 3
          },
          {
            "exercise_id": 19,
            "reps": 10,
            "sets": 3
          },
          {
            "exercise_id": 13,
            "reps": 10,
            "sets": 3
          },
          {
            "exercise_id": 39,
            "reps": 12,
            "sets": 2
          },
          {
            "exercise_id": 43,
            "reps": 12,
            "sets": 2
          }
        ]
      },
      {
        "name": "Lower Body",
        "exercises": [
          {
            "exercise_id": 2,
            "reps": 10,
            "sets": 3
          },
          {
            "exercise_id": 28,
            "reps": 12,
            "sets": 3
          },
          {
            "exercise_id": 26,
            "reps": 12,
            "sets": 3
          },
          {
            "exercise_id": 32,
            "reps": 15,
            "sets": 3
          },
          {
            "exercise_id": 36,
            "reps": 20,
            "sets": 3
          }
        ]
      },
      {
        "name": "Core Focus",
        "exercises": [
          {
            "exercise_id": 3,
            "duration_seconds": 60,
            "sets": 3
          },
          {
            "exercise_id": 45,
            "reps": 20,
            "sets": 3
          },
          {
            "exercise_id": 46,
            "reps": 15,
            "sets": 3
          },
          {
            "exercise_id": 47,
            "reps": 20,
            "sets": 3
          },
          {
            "exercise_id": 49,
            "reps": 20,
            "sets": 3
          }
        ]
      },
      {
        "name": "Cardio & Core",
        "exercises": [
          {
            "exercise_id": 4,
            "duration_seconds": 120
          },
          {
            "exercise_id": 37,
            "duration_seconds": 120
          },
          {
            "exercise_id": 3,
            "duration_seconds": 60,
            "sets": 2
          },
          {
            "exercise_id": 49,
            "reps": 25,
            "sets": 2
          },
          {
            "exercise_id": 46,
            "reps": 20,
            "sets": 2
          }
        ]
      }
    ];
    const defaultWorkoutLog = [
      {
        "date": "2025-07-08 21:19:31",
        "session_name": "test"
      }
    ];

    // --- App Initialization ---
    
    loadData();
    renderDashboard();

    // --- Load data from local storage or use defaults ---
    function loadData(fromDefaults = false) {
        exercises = defaultExercises;
        muscles = defaultMuscles;

        const savedSessions = localStorage.getItem('sessions');
        sessions = (savedSessions && !fromDefaults) ? JSON.parse(savedSessions) : defaultSessions;
        
        const savedLog = localStorage.getItem('workoutLog');
        workoutLog = (savedLog && !fromDefaults) ? JSON.parse(savedLog) : defaultWorkoutLog;

        const savedFavExercises = localStorage.getItem('favoriteExercises');
        favoriteExercises = savedFavExercises ? JSON.parse(savedFavExercises) : [];

        const savedFavSessions = localStorage.getItem('favoriteSessions');
        favoriteSessions = savedFavSessions ? JSON.parse(savedFavSessions) : [];

        if (fromDefaults) {
            localStorage.setItem('sessions', JSON.stringify(defaultSessions));
            localStorage.setItem('workoutLog', JSON.stringify(defaultWorkoutLog));
            localStorage.setItem('favoriteExercises', JSON.stringify([]));
            localStorage.setItem('favoriteSessions', JSON.stringify([]));
            sessions = defaultSessions;
            workoutLog = defaultWorkoutLog;
            favoriteExercises = [];
            favoriteSessions = [];
        }
    }

    // --- Render Functions ---

    function renderDashboard() {
        mainContent.innerHTML = '<h2>Dashboard</h2>';
        
        const favExercisesSection = document.createElement('div');
        favExercisesSection.className = 'dashboard-section';
        favExercisesSection.innerHTML = '<h3>Favorite Exercises</h3>';
        const favExList = document.createElement('div');
        const favEx = exercises.filter(ex => favoriteExercises.includes(ex.id));
        if (favEx.length > 0) {
            favEx.forEach(ex => {
                const exerciseEl = document.createElement('div');
                exerciseEl.className = 'exercise';
                exerciseEl.innerHTML = `
                    <button class="fav-btn favorited" onclick="toggleFavoriteExercise(${ex.id})">&#9733;</button>
                    <h4>${ex.name}</h4>
                    <p>${ex.description}</p>
                `;
                favExList.appendChild(exerciseEl);
            });
        } else {
            favExList.innerHTML = '<p>No favorite exercises yet. Find an exercise and click the star!</p>';
        }
        favExercisesSection.appendChild(favExList);
        mainContent.appendChild(favExercisesSection);

        const favSessionsSection = document.createElement('div');
        favSessionsSection.className = 'dashboard-section';
        favSessionsSection.innerHTML = '<h3>Favorite Sessions</h3>';
        const favSessList = document.createElement('div');
        const favSess = sessions.filter(s => favoriteSessions.includes(s.name));
        if (favSess.length > 0) {
            favSess.forEach(session => {
                const sessionEl = document.createElement('div');
                sessionEl.className = 'session';
                const sessionIndex = sessions.findIndex(s => s.name === session.name);
                sessionEl.innerHTML = `
                    <button class="fav-btn favorited" onclick="toggleFavoriteSession('${session.name}')">&#9733;</button>
                    <h4>${session.name}</h4>
                    <button onclick="startSession(${sessionIndex})">Start Session</button>
                `;
                favSessList.appendChild(sessionEl);
            });
        } else {
            favSessList.innerHTML = '<p>No favorite sessions yet. Find a session and click the star!</p>';
        }
        favSessionsSection.appendChild(favSessList);
        mainContent.appendChild(favSessionsSection);
    }

    function renderExercises(filteredExercises = exercises) {
        let content = '<h2>Exercise Library</h2>';
        if (filteredExercises.length === 0) {
            content += '<p>No exercises found.</p>';
        } else {
            filteredExercises.forEach(ex => {
                const isFavorited = favoriteExercises.includes(ex.id);
                let musclesHtml = '<div class="muscles-container">';
                if (ex.muscle_ids && ex.muscle_ids.length > 0) {
                    ex.muscle_ids.forEach(muscleId => {
                        const muscle = muscles.find(m => m.id === muscleId);
                        if (muscle) {
                            musclesHtml += `
                                <div class="muscle-item">
                                    <img src="${muscle.image_url}" alt="${muscle.name}" class="muscle-image" onerror="this.parentElement.innerHTML = '<p class=\'muscle-name\'>${muscle.name} image</p>';">
                                </div>
                            `;
                        }
                    });
                }
                musclesHtml += '</div>';

                content += `
                    <div class="exercise">
                        <button class="fav-btn ${isFavorited ? 'favorited' : ''}" onclick="toggleFavoriteExercise(${ex.id})">${isFavorited ? '&#9733;' : '&#9734;'}</button>
                        <h3>${ex.name} (ID: ${ex.id})</h3>
                        <p>${ex.description}</p>
                        <p><strong>Muscles:</strong> ${ex.muscles.join(', ')}</p>
                        ${musclesHtml}
                    </div>
                `;
            });
        }
        mainContent.innerHTML = content;
    }

    function renderSessions(filteredSessions = sessions) {
        let content = '<h2>Workout Sessions</h2>';
        if (filteredSessions.length === 0) {
            content += '<p>No sessions found.</p>';
        } else {
            filteredSessions.forEach(session => {
                const isFavorited = favoriteSessions.includes(session.name);
                const sessionIndex = sessions.findIndex(s => s.name === session.name);
                let exercisesHtml = '<ul>';
                session.exercises.forEach(exDetail => {
                    const exercise = exercises.find(e => e.id === exDetail.exercise_id);
                    if (exercise) {
                        exercisesHtml += `<li>${exercise.name}: ${exDetail.sets ? `${exDetail.sets} sets of ${exDetail.reps} reps` : `${exDetail.duration_seconds} seconds`}</li>`;
                    }
                });
                exercisesHtml += '</ul>';
                content += `
                    <div class="session">
                        <button class="fav-btn ${isFavorited ? 'favorited' : ''}" onclick="toggleFavoriteSession('${session.name}')">${isFavorited ? '&#9733;' : '&#9734;'}</button>
                        <h3>${session.name}</h3>
                        ${exercisesHtml}
                        <div class="session-controls">
                            <button onclick="startSession(${sessionIndex})">Start</button>
                            ${session.is_custom ? `<button onclick="editSession(${sessionIndex})">Edit</button>` : ''}
                            ${session.is_custom ? `<button onclick="deleteSession(${sessionIndex})">Delete</button>` : ''}
                        </div>
                    </div>
                `;
            });
        }
        mainContent.innerHTML = content;
    }

    function renderWorkoutLog() {
        mainContent.innerHTML = '<h2>Workout Log</h2>';
        if (workoutLog.length === 0) {
            mainContent.innerHTML += '<p>No workouts logged yet.</p>';
            return;
        }
        const sortedLogs = [...workoutLog].sort((a, b) => new Date(b.date) - new Date(a.date));
        sortedLogs.forEach((log, index) => {
            const logEl = document.createElement('div');
            logEl.className = 'log-entry';
            // The original index is needed for deletion from the unsorted array
            const originalIndex = workoutLog.indexOf(log);
            logEl.innerHTML = `
                <div class="log-header">
                    <h3>${log.session_name}</h3>
                    <button class="delete-log-btn" onclick="deleteLogEntry(${originalIndex})">🗑️</button>
                </div>
                <p>Completed on: ${new Date(log.date).toLocaleString()}</p>
            `;
            mainContent.appendChild(logEl);
        });
    }

    function renderCreateSessionForm() {
        newSessionExercises = [];
        mainContent.innerHTML = `
            <h2>Create New Session</h2>
            <div class="session-header">
                <input type="text" id="session-name" placeholder="Session Name" required>
                <button id="new-session-fav-btn" class="fav-btn favorited" onclick="toggleNewSessionFavorite()">&#9733;</button>
            </div>
            <div id="new-session-exercises"></div>
            <hr>
            <h3>Add Exercise</h3>
            <select id="exercise-select">
                ${exercises.map(ex => `<option value="${ex.id}">${ex.name}</option>`).join('')}
            </select>
            <input type="number" id="sets-input" placeholder="Sets">
            <input type="number" id="reps-input" placeholder="Reps">
            <input type="number" id="duration-input" placeholder="Duration (seconds)">
            <button id="add-exercise-btn">Add Exercise</button>
            <hr>
            <button id="save-session-btn">Save Session</button>
        `;

        document.getElementById('add-exercise-btn').addEventListener('click', addExerciseToSession);
        document.getElementById('save-session-btn').addEventListener('click', saveSession);
    }

    function renderEditSessionForm(index) {
        const session = sessions[index];
        newSessionExercises = [...session.exercises]; // Copy exercises to edit

        mainContent.innerHTML = `
            <h2>Edit Session</h2>
            <div class="session-header">
                <input type="text" id="session-name" value="${session.name}" required>
            </div>
            <div id="new-session-exercises"></div>
            <hr>
            <h3>Add Exercise</h3>
            <select id="exercise-select">
                ${exercises.map(ex => `<option value="${ex.id}">${ex.name}</option>`).join('')}
            </select>
            <input type="number" id="sets-input" placeholder="Sets">
            <input type="number" id="reps-input" placeholder="Reps">
            <input type="number" id="duration-input" placeholder="Duration (seconds)">
            <button id="add-exercise-btn">Add Exercise</button>
            <hr>
            <button id="update-session-btn">Update Session</button>
        `;

        renderNewSessionExercises(); // Display existing exercises

        document.getElementById('add-exercise-btn').addEventListener('click', addExerciseToSession);
        document.getElementById('update-session-btn').addEventListener('click', () => updateSession(index));
    }

    function renderActiveWorkout() {
        const session = sessions[currentSessionIndex];
        const exerciseDetail = session.exercises[currentExerciseIndex];
        const exercise = exercises.find(e => e.id === exerciseDetail.exercise_id);

        mainContent.innerHTML = `
            <h2>${session.name}</h2>
            <h3>${exercise.name}</h3>
            <p>${exercise.description}</p>
            <div id="workout-details"></div>
            <div id="timer"></div>
            <button id="prev-exercise-btn">Previous</button>
            <button id="next-exercise-btn">Next</button>
            <button id="finish-workout-btn">Finish Workout</button>
        `;

        const workoutDetails = document.getElementById('workout-details');
        if (exerciseDetail.duration_seconds) {
            workoutDetails.innerHTML = `<p>Duration: ${exerciseDetail.duration_seconds} seconds</p>`;
            startTimer(exerciseDetail.duration_seconds);
        } else {
            workoutDetails.innerHTML = `<p>Sets: ${exerciseDetail.sets}, Reps: ${exerciseDetail.reps}</p>`;
        }

        document.getElementById('prev-exercise-btn').addEventListener('click', prevExercise);
        document.getElementById('next-exercise-btn').addEventListener('click', nextExercise);
        document.getElementById('finish-workout-btn').addEventListener('click', finishWorkout);
    }

    // --- Logic Functions ---

    function addExerciseToSession() {
        const exerciseId = parseInt(document.getElementById('exercise-select').value);
        const sets = document.getElementById('sets-input').value;
        const reps = document.getElementById('reps-input').value;
        const duration = document.getElementById('duration-input').value;

        const exerciseDetails = { exercise_id: exerciseId };
        if (sets && reps) {
            exerciseDetails.sets = parseInt(sets);
            exerciseDetails.reps = parseInt(reps);
        } else if (duration) {
            exerciseDetails.duration_seconds = parseInt(duration);
        } else {
            alert('Please provide either sets and reps or a duration.');
            return;
        }

        newSessionExercises.push(exerciseDetails);
        renderNewSessionExercises();
    }

    function renderNewSessionExercises() {
        const container = document.getElementById('new-session-exercises');
        container.innerHTML = '<h3>Exercises in this session:</h3>';
        const list = document.createElement('ul');
        newSessionExercises.forEach(exDetail => {
            const exercise = exercises.find(e => e.id === exDetail.exercise_id);
            if (exercise) {
                const listItem = document.createElement('li');
                listItem.textContent = `${exercise.name}: ${exDetail.sets ? `${exDetail.sets} sets of ${exDetail.reps} reps` : `${exDetail.duration_seconds} seconds`}`;
                list.appendChild(listItem);
            }
        });
        container.appendChild(list);
    }

    function saveSession() {
        const sessionName = document.getElementById('session-name').value;
        if (!sessionName) {
            alert('Please enter a name for the session.');
            return;
        }
        if (newSessionExercises.length === 0) {
            alert('Please add at least one exercise to the session.');
            return;
        }

        sessions.push({
            name: sessionName,
            exercises: newSessionExercises,
            is_custom: true
        });
        localStorage.setItem('sessions', JSON.stringify(sessions));

        const favBtn = document.getElementById('new-session-fav-btn');
        if (favBtn && favBtn.classList.contains('favorited')) {
            if (!favoriteSessions.includes(sessionName)) {
                favoriteSessions.push(sessionName);
                localStorage.setItem('favoriteSessions', JSON.stringify(favoriteSessions));
            }
        }

        alert('Session saved!');
        renderSessions();
    }
    
    function loadDefaults() {
        if (confirm('Are you sure you want to load the default sessions? This will overwrite your saved sessions and favorites.')) {
            loadData(true);
            renderDashboard();
            alert('Default sessions and log have been loaded.');
        }
    }

    function handleSearch() {
        const searchTerm = searchBar.value.toLowerCase();
        if (searchTerm.length === 0) {
            renderDashboard();
            return;
        }

        const filteredExercises = exercises.filter(ex => ex.name.toLowerCase().includes(searchTerm) || ex.muscles.join(' ').toLowerCase().includes(searchTerm));
        const filteredSessions = sessions.filter(s => s.name.toLowerCase().includes(searchTerm));
        
        const totalResults = filteredExercises.length + filteredSessions.length;
        let resultsHTML = `<h2>Search Results</h2><p>${totalResults} result(s) found.</p>`;

        if (filteredExercises.length > 0) {
            resultsHTML += '<h3>Matching Exercises</h3>';
            filteredExercises.forEach(ex => {
                const isFavorited = favoriteExercises.includes(ex.id);
                let musclesHtml = '<div class="muscles-container">';
                if (ex.muscle_ids && ex.muscle_ids.length > 0) {
                    ex.muscle_ids.forEach(muscleId => {
                        const muscle = muscles.find(m => m.id === muscleId);
                        if (muscle) {
                            musclesHtml += `
                                <div class="muscle-item">
                                    <img src="${muscle.image_url}" alt="${muscle.name}" class="muscle-image" onerror="this.parentElement.innerHTML = '<p class=\'muscle-name\'>${muscle.name} image</p>';">
                                </div>
                            `;
                        }
                    });
                }
                musclesHtml += '</div>';

                resultsHTML += `
                    <div class="exercise">
                        <button class="fav-btn ${isFavorited ? 'favorited' : ''}" onclick="toggleFavoriteExercise(${ex.id})">${isFavorited ? '&#9733;' : '&#9734;'}</button>
                        <h3>${ex.name} (ID: ${ex.id})</h3>
                        <p>${ex.description}</p>
                        <p><strong>Muscles:</strong> ${ex.muscles.join(', ')}</p>
                        ${musclesHtml}
                    </div>
                `;
            });
        }
        if (filteredSessions.length > 0) {
            resultsHTML += '<h3>Matching Sessions</h3>';
            filteredSessions.forEach(session => {
                const isFavorited = favoriteSessions.includes(session.name);
                const sessionIndex = sessions.findIndex(s => s.name === session.name);
                let exercisesHtml = '<ul>';
                session.exercises.forEach(exDetail => {
                    const exercise = exercises.find(e => e.id === exDetail.exercise_id);
                    if (exercise) {
                        exercisesHtml += `<li>${exercise.name}: ${exDetail.sets ? `${exDetail.sets} sets of ${exDetail.reps} reps` : `${exDetail.duration_seconds} seconds`}</li>`;
                    }
                });
                exercisesHtml += '</ul>';
                resultsHTML += `
                    <div class="session">
                        <button class="fav-btn ${isFavorited ? 'favorited' : ''}" onclick="toggleFavoriteSession('${session.name}')">${isFavorited ? '&#9733;' : '&#9734;'}</button>
                        <h3>${session.name}</h3>
                        ${exercisesHtml}
                        <button onclick="startSession(${sessionIndex})">Start Session</button>
                    </div>
                `;
            });
        }
        if (totalResults === 0) {
            resultsHTML += '<p>No results found.</p>';
        }
        mainContent.innerHTML = resultsHTML;
    }

    function closeSidebarOnMobile() {
        if (window.innerWidth <= 768 && sidebar.classList.contains('visible')) {
            sidebar.classList.remove('visible');
        }
    }

    // --- Event Listeners ---
    
homeBtn.addEventListener('click', () => {
        renderDashboard();
        closeSidebarOnMobile();
    });
    viewExercisesBtn.addEventListener('click', () => {
        renderExercises();
        closeSidebarOnMobile();
    });
    viewSessionsBtn.addEventListener('click', () => {
        renderSessions();
        closeSidebarOnMobile();
    });
    viewLogBtn.addEventListener('click', () => {
        renderWorkoutLog();
        closeSidebarOnMobile();
    });
    createSessionBtn.addEventListener('click', () => {
        renderCreateSessionForm();
        closeSidebarOnMobile();
    });
    loadDefaultsBtn.addEventListener('click', () => {
        loadDefaults();
        closeSidebarOnMobile();
    });
    searchBtn.addEventListener('click', () => {
        handleSearch();
        closeSidebarOnMobile();
    });

    searchBar.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    searchBar.addEventListener('input', handleSearch); // Keeps real-time search

    sidebarToggleDesktop.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('visible');
        });
    }
});

// --- Global Functions for inline HTML onclick ---

function toggleFavoriteExercise(id) {
    const index = favoriteExercises.indexOf(id);
    if (index > -1) {
        favoriteExercises.splice(index, 1);
    } else {
        favoriteExercises.push(id);
    }
    localStorage.setItem('favoriteExercises', JSON.stringify(favoriteExercises));
    
    // Re-render the current view to reflect the change
    const searchBar = document.getElementById('search-bar');
    const mainContent = document.getElementById('main-content');
    if (searchBar.value) {
        // This is a global function, so we need to find a way to call handleSearch
        // A simple way is to trigger the input event again
        searchBar.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (mainContent.querySelector('.dashboard-section')) {
        // Or find a way to call renderDashboard
        document.getElementById('home-btn').click(); // Simulate a click
    } else {
        // Or find a way to call renderExercises
        document.getElementById('view-exercises-btn').click();
    }
}

function toggleFavoriteSession(name) {
    const index = favoriteSessions.indexOf(name);
    if (index > -1) {
        favoriteSessions.splice(index, 1);
    } else {
        favoriteSessions.push(name);
    }
    localStorage.setItem('favoriteSessions', JSON.stringify(favoriteSessions));

    // Re-render the current view to reflect the change
    const searchBar = document.getElementById('search-bar');
    const mainContent = document.getElementById('main-content');
    if (searchBar.value) {
        searchBar.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (mainContent.querySelector('.dashboard-section')) {
        document.getElementById('home-btn').click();
    } else {
        document.getElementById('view-sessions-btn').click();
    }
}

function deleteSession(index) {
    if (confirm(`Are you sure you want to delete the "${sessions[index].name}" session?`)) {
        const sessionName = sessions[index].name;
        sessions.splice(index, 1);
        localStorage.setItem('sessions', JSON.stringify(sessions));

        const favIndex = favoriteSessions.indexOf(sessionName);
        if (favIndex > -1) {
            favoriteSessions.splice(favIndex, 1);
            localStorage.setItem('favoriteSessions', JSON.stringify(favoriteSessions));
        }

        renderSessions();
    }
}

function editSession(index) {
    renderEditSessionForm(index);
}

function updateSession(index) {
    const sessionName = document.getElementById('session-name').value;
    if (!sessionName) {
        alert('Please enter a name for the session.');
        return;
    }
    if (newSessionExercises.length === 0) {
        alert('Please add at least one exercise to the session.');
        return;
    }

    const oldSessionName = sessions[index].name;
    sessions[index] = {
        name: sessionName,
        exercises: newSessionExercises,
        is_custom: true
    };
    localStorage.setItem('sessions', JSON.stringify(sessions));

    const favIndex = favoriteSessions.indexOf(oldSessionName);
    if (favIndex > -1) {
        favoriteSessions[favIndex] = sessionName;
        localStorage.setItem('favoriteSessions', JSON.stringify(favoriteSessions));
    }

    alert('Session updated!');
    renderSessions();
}

function toggleNewSessionFavorite() {
    const favBtn = document.getElementById('new-session-fav-btn');
    if (favBtn) {
        favBtn.classList.toggle('favorited');
        favBtn.innerHTML = favBtn.classList.contains('favorited') ? '&#9733;' : '&#9734;';
    }
}

function deleteLogEntry(index) {
    if (confirm(`Are you sure you want to delete this log entry?`)) {
        workoutLog.splice(index, 1);
        localStorage.setItem('workoutLog', JSON.stringify(workoutLog));
        renderWorkoutLog();
    }
}

function startSession(index) {
    currentSessionIndex = index;
    currentExerciseIndex = 0;
    // This function needs access to renderActiveWorkout, which is inside DOMContentLoaded
    // A simple solution is to make renderActiveWorkout global as well.
    renderActiveWorkout();
}

function prevExercise() {
    if (currentExerciseIndex > 0) {
        currentExerciseIndex--;
        renderActiveWorkout();
    }
}

function nextExercise() {
    const session = sessions[currentSessionIndex];
    if (currentExerciseIndex < session.exercises.length - 1) {
        currentExerciseIndex++;
        renderActiveWorkout();
    } else {
        alert('Last exercise!');
    }
}

function finishWorkout() {
    const session = sessions[currentSessionIndex];
    workoutLog.push({
        session_name: session.name,
        date: new Date().toISOString()
    });
    localStorage.setItem('workoutLog', JSON.stringify(workoutLog));
    alert('Workout finished and logged!');
    document.getElementById('view-log-btn').click(); // Go to log view
}

function startTimer(duration) {
    const timerEl = document.getElementById('timer');
    let timeLeft = duration;
    timerEl.textContent = `Time left: ${timeLeft}`;
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time left: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerEl.textContent = "Time's up!";
        }
    }, 1000);
}

function renderActiveWorkout() {
    const mainContent = document.getElementById('main-content');
    const session = sessions[currentSessionIndex];
    const exerciseDetail = session.exercises[currentExerciseIndex];
    const exercise = exercises.find(e => e.id === exerciseDetail.exercise_id);

    mainContent.innerHTML = `
        <h2>${session.name}</h2>
        <h3>${exercise.name}</h3>
        <p>${exercise.description}</p>
        <div id="workout-details"></div>
        <div id="timer"></div>
        <button id="prev-exercise-btn">Previous</button>
        <button id="next-exercise-btn">Next</button>
        <button id="finish-workout-btn">Finish Workout</button>
    `;

    const workoutDetails = document.getElementById('workout-details');
    if (exerciseDetail.duration_seconds) {
        workoutDetails.innerHTML = `<p>Duration: ${exerciseDetail.duration_seconds} seconds</p>`;
        startTimer(exerciseDetail.duration_seconds);
    } else {
        workoutDetails.innerHTML = `<p>Sets: ${exerciseDetail.sets}, Reps: ${exerciseDetail.reps}</p>`;
    }

    // We need to re-add event listeners because we overwrote mainContent.innerHTML
    document.getElementById('prev-exercise-btn').addEventListener('click', prevExercise);
    document.getElementById('next-exercise-btn').addEventListener('click', nextExercise);
    document.getElementById('finish-workout-btn').addEventListener('click', finishWorkout);
}


function renderEditSessionForm(index) {
    const mainContent = document.getElementById('main-content');
    const session = sessions[index];
    newSessionExercises = [...session.exercises]; // Copy exercises to edit

    mainContent.innerHTML = `
        <h2>Edit Session</h2>
        <div class="session-header">
            <input type="text" id="session-name" value="${session.name}" required>
        </div>
        <div id="new-session-exercises"></div>
        <hr>
        <h3>Add Exercise</h3>
        <select id="exercise-select">
            ${exercises.map(ex => `<option value="${ex.id}">${ex.name}</option>`).join('')}
        </select>
        <input type="number" id="sets-input" placeholder="Sets">
        <input type="number" id="reps-input" placeholder="Reps">
        <input type="number" id="duration-input" placeholder="Duration (seconds)">
        <button id="add-exercise-btn">Add Exercise</button>
        <hr>
        <button id="update-session-btn">Update Session</button>
    `;

    renderNewSessionExercises(); // Display existing exercises

    document.getElementById('add-exercise-btn').addEventListener('click', addExerciseToSession);
    document.getElementById('update-session-btn').addEventListener('click', () => updateSession(index));
}

function renderNewSessionExercises() {
    const container = document.getElementById('new-session-exercises');
    container.innerHTML = '<h3>Exercises in this session:</h3>';
    const list = document.createElement('ul');
    newSessionExercises.forEach((exDetail, index) => {
        const exercise = exercises.find(e => e.id === exDetail.exercise_id);
        if (exercise) {
            const listItem = document.createElement('li');
            listItem.textContent = `${exercise.name}: ${exDetail.sets ? `${exDetail.sets} sets of ${exDetail.reps} reps` : `${exDetail.duration_seconds} seconds`}`;
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.onclick = () => {
                newSessionExercises.splice(index, 1);
                renderNewSessionExercises(); // Re-render the list
            };
            listItem.appendChild(removeBtn);
            
            list.appendChild(listItem);
        }
    });
    container.appendChild(list);
}