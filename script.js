let currentSessionIndex = null;
let currentExerciseIndex = 0;
let timerInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const viewExercisesBtn = document.getElementById('view-exercises-btn');
    const viewSessionsBtn = document.getElementById('view-sessions-btn');
    const createSessionBtn = document.getElementById('create-session-btn');
    const viewLogBtn = document.getElementById('view-log-btn');
    const loadDefaultsBtn = document.getElementById('load-defaults-btn');

    let exercises = [];
    let sessions = [];
    let workoutLog = [];
    let newSessionExercises = [];

    // Load data from JSON files
    async function loadData(fromDefaults = false) {
        try {
            const [exercisesRes, sessionsRes, logRes] = await Promise.all([
                fetch('./exercises.json'),
                fetch('./sessions.json'),
                fetch('./workout_log.json')
            ]);
            exercises = await exercisesRes.json();
            
            const savedSessions = localStorage.getItem('sessions');
            sessions = (savedSessions && !fromDefaults) ? JSON.parse(savedSessions) : await sessionsRes.json();
            
            const savedLog = localStorage.getItem('workoutLog');
            workoutLog = (savedLog && !fromDefaults) ? JSON.parse(savedLog) : await logRes.json();

            if (fromDefaults) {
                localStorage.setItem('sessions', JSON.stringify(sessions));
                localStorage.setItem('workoutLog', JSON.stringify(workoutLog));
            }

        } catch (error) {
            console.error("Error loading data:", error);
            mainContent.innerHTML = '<p>Error loading data. Please make sure the JSON files are available.</p>';
        }
    }

    // --- Render Functions ---

    function renderExercises() {
        mainContent.innerHTML = '<h2>Exercise Library</h2>';
        if (exercises.length === 0) {
            mainContent.innerHTML += '<p>No exercises loaded. This may be due to browser security restrictions when running local files. Please try using a local server.</p>';
            return;
        }
        exercises.forEach(ex => {
            const exerciseEl = document.createElement('div');
            exerciseEl.className = 'exercise';
            exerciseEl.innerHTML = `
                <h3>${ex.name} (ID: ${ex.id})</h3>
                <p>${ex.description}</p>
                <p><strong>Muscles:</strong> ${ex.muscles.join(', ')}</p>
            `;
            mainContent.appendChild(exerciseEl);
        });
    }

    function renderSessions() {
        mainContent.innerHTML = '<h2>Workout Sessions</h2>';
        if (sessions.length === 0) {
            mainContent.innerHTML += '<p>No sessions loaded. This may be due to browser security restrictions when running local files. Please try using a local server.</p>';
            return;
        }
        sessions.forEach((session, index) => {
            const sessionEl = document.createElement('div');
            sessionEl.className = 'session';
            let exercisesHtml = '<ul>';
            session.exercises.forEach(exDetail => {
                const exercise = exercises.find(e => e.id === exDetail.exercise_id);
                if (exercise) {
                    exercisesHtml += `<li>${exercise.name}: ${exDetail.sets ? `${exDetail.sets} sets of ${exDetail.reps} reps` : `${exDetail.duration_seconds} seconds`}</li>`;
                }
            });
            exercisesHtml += '</ul>';
            sessionEl.innerHTML = `
                <h3>${session.name}</h3>
                ${exercisesHtml}
                <button onclick="startSession(${index})">Start Session</button>
            `;
            mainContent.appendChild(sessionEl);
        });
    }

    function renderWorkoutLog() {
        mainContent.innerHTML = '<h2>Workout Log</h2>';
        const sortedLogs = [...workoutLog].sort((a, b) => new Date(b.date) - new Date(a.date));
        sortedLogs.forEach(log => {
            const logEl = document.createElement('div');
            logEl.className = 'log-entry';
            logEl.innerHTML = `
                <h3>${log.session_name}</h3>
                <p>Completed on: ${new Date(log.date).toLocaleString()}</p>
            `;
            mainContent.appendChild(logEl);
        });
    }

    function renderCreateSessionForm() {
        newSessionExercises = [];
        mainContent.innerHTML = `
            <h2>Create New Session</h2>
            <input type="text" id="session-name" placeholder="Session Name" required>
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
            exercises: newSessionExercises
        });
        localStorage.setItem('sessions', JSON.stringify(sessions));
        alert('Session saved!');
        renderSessions();
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
        renderWorkoutLog();
    }
    
    function loadDefaults() {
        if (confirm('Are you sure you want to load the default sessions? This will overwrite your saved sessions.')) {
            localStorage.removeItem('sessions');
            localStorage.removeItem('workoutLog');
            loadData(true).then(() => {
                renderSessions();
                alert('Default sessions and log have been loaded.');
            });
        }
    }

    // --- Event Listeners ---
    
    viewExercisesBtn.addEventListener('click', renderExercises);
    viewSessionsBtn.addEventListener('click', renderSessions);
    viewLogBtn.addEventListener('click', renderWorkoutLog);
    createSessionBtn.addEventListener('click', renderCreateSessionForm);
    loadDefaultsBtn.addEventListener('click', loadDefaults);


    // --- App Initialization ---
    
    loadData().then(() => {
        renderExercises(); // Show exercises by default
    });
});

function startSession(index) {
    currentSessionIndex = index;
    currentExerciseIndex = 0;
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

    document.getElementById('prev-exercise-btn').addEventListener('click', prevExercise);
    document.getElementById('next-exercise-btn').addEventListener('click', nextExercise);
    document.getElementById('finish-workout-btn').addEventListener('click', finishWorkout);
}
