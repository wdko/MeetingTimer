// Utility to parse timers from URL
function getTimersFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const timers = [];
    let i = 0;
    while (params.has(`topic${i}`) && params.has(`time${i}`)) {
        timers.push({
            topic: params.get(`topic${i}`),
            time: parseInt(params.get(`time${i}`), 10)
        });
        i++;
    }
    return timers;
}

function updateShareUrl() {
    const params = timers.map((t, i) => `topic${i}=${encodeURIComponent(t.topic)}&time${i}=${t.time}`).join('&');
    const url = `${window.location.origin}${window.location.pathname}?${params}`;
    document.getElementById('shareInput').value = url;
}

let timers = [];
let activeTimerIndex = 0;
let timerIntervals = {}; // Store timer intervals by index
let timerStates = {}; // Store timer states (stopped, running, paused)
let selectedAlarmSound = 'sine'; // Default alarm sound
let autoAdvanceEnabled = false; // Auto-advance feature flag

function renderTimers() {
    const timersDiv = document.getElementById('timers');
    timersDiv.innerHTML = '';
    timers.forEach((timer, i) => {
        const timerEl = document.createElement('div');
        timerEl.className = 'timer';
        
        const state = timerStates[i] || 'stopped';
        const isRunning = state === 'running';
        const isPaused = state === 'paused';
        
        timerEl.innerHTML = `
            <button class="remove-timer" title="Remove Timer">×</button>
            <div class="timer-options">
                <input id="topic-${i}" type="text" placeholder="Topic" value="${timer.topic}" ${isRunning ? 'disabled' : ''} />
                <input id="time-${i}" type="number" min="1" value="${timer.time}" ${isRunning || isPaused ? 'disabled' : ''} />
            </div>
            <span class="countdown">${timer.display || `${timer.time}:00`}</span>
            <div class="timer-actions">
                <button class="start" ${isRunning ? 'disabled' : ''}>${isPaused ? 'Resume' : 'Start'}</button>
                <button class="pause" ${!isRunning ? 'disabled' : ''}>Pause</button>
                <button class="stop" ${state === 'stopped' ? 'disabled' : ''}>Stop</button>
            </div>
        `;
        
        // Remove timer
        timerEl.querySelector('.remove-timer').onclick = (e) => {
            e.stopPropagation();
            stopTimer(i);
            timers.splice(i, 1);
            delete timerIntervals[i];
            delete timerStates[i];
            if (activeTimerIndex >= timers.length) activeTimerIndex = timers.length - 1;
            renderTimers();
            updateShareUrl();
        };
        
        // Edit topic
        timerEl.querySelector('input[type="text"]').oninput = function() {
            timers[i].topic = this.value;
            updateShareUrl();
        };
        
        // Edit time
        timerEl.querySelector('input[type="number"]').oninput = function() {
            timers[i].time = this.value;
            timers[i].display = `${this.value}:00`;
            updateShareUrl();
        };
        
        // Start/Resume timer
        timerEl.querySelector('.start').onclick = function(e) {
            e.stopPropagation();
            if (isPaused) {
                resumeTimer(i);
            } else {
                startTimer(i);
            }
        };
        
        // Pause timer
        timerEl.querySelector('.pause').onclick = function(e) {
            e.stopPropagation();
            pauseTimer(i);
        };
        
        // Stop timer
        timerEl.querySelector('.stop').onclick = function(e) {
            e.stopPropagation();
            stopTimer(i);
        };
        
        // Select timer
        timerEl.onclick = () => {
            activeTimerIndex = i;
        };
        
        timersDiv.appendChild(timerEl);
    });
    updateShareUrl();
}

function addTimer(topic = '', time = 5) {
    timers.push({ topic, time, display: `${time}:00` });
    activeTimerIndex = timers.length - 1;
    renderTimers();
}

function startTimer(i) {
    const timer = timers[i];
    let seconds = parseInt(timer.time, 10) * 60;
    timerStates[i] = 'running';
    
    timerIntervals[i] = setInterval(() => {
        if (seconds <= 0) {
            clearInterval(timerIntervals[i]);
            delete timerIntervals[i];
            timerStates[i] = 'stopped';
            timers[i].display = 'Done!';
            playEndSound();
            renderTimers();
            
            // Auto-advance to next timer if enabled
            if (autoAdvanceEnabled) {
                autoAdvanceToNextTimer(i);
            }
            return;
        }
        seconds--;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        const timeDisplay = `${m}:${s.toString().padStart(2, '0')}`;
        timers[i].display = timeDisplay;
        timers[i].remainingSeconds = seconds;
        
        // Update the display in real-time
        const timerEl = document.querySelectorAll('.timer')[i];
        if (timerEl) {
            timerEl.querySelector('.countdown').textContent = timeDisplay;
        }
    }, 1000);
    
    renderTimers();
}

function pauseTimer(i) {
    if (timerIntervals[i]) {
        clearInterval(timerIntervals[i]);
        delete timerIntervals[i];
        timerStates[i] = 'paused';
        renderTimers();
    }
}

function resumeTimer(i) {
    const timer = timers[i];
    let seconds = timer.remainingSeconds || parseInt(timer.time, 10) * 60;
    timerStates[i] = 'running';
    
    timerIntervals[i] = setInterval(() => {
        if (seconds <= 0) {
            clearInterval(timerIntervals[i]);
            delete timerIntervals[i];
            timerStates[i] = 'stopped';
            timers[i].display = 'Done!';
            playEndSound();
            renderTimers();
            
            // Auto-advance to next timer if enabled
            if (autoAdvanceEnabled) {
                autoAdvanceToNextTimer(i);
            }
            return;
        }
        seconds--;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        const timeDisplay = `${m}:${s.toString().padStart(2, '0')}`;
        timers[i].display = timeDisplay;
        timers[i].remainingSeconds = seconds;
        
        // Update the display in real-time
        const timerEl = document.querySelectorAll('.timer')[i];
        if (timerEl) {
            timerEl.querySelector('.countdown').textContent = timeDisplay;
        }
    }, 1000);
    
    renderTimers();
}

function stopTimer(i) {
    if (timerIntervals[i]) {
        clearInterval(timerIntervals[i]);
        delete timerIntervals[i];
    }
    timerStates[i] = 'stopped';
    const timer = timers[i];
    timer.display = `${timer.time}:00`;
    delete timer.remainingSeconds;
    renderTimers();
}

function playEndSound() {
    try {
        // Check if it's a WAV file sound
        if (['wakey', 'digital', 'distant'].includes(selectedAlarmSound)) {
            playWavSound(selectedAlarmSound);
            return;
        }
        
        // Use Web Audio API for synthetic sounds
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        switch (selectedAlarmSound) {
            case 'sine':
                playSineWave(ctx);
                break;
            case 'square':
                playSquareWave(ctx);
                break;
            case 'chimes':
                playChimes(ctx);
                break;
            case 'triangle':
                playTriangleWave(ctx);
                break;
            case 'sawtooth':
                playSawtoothWave(ctx);
                break;
            default:
                playSineWave(ctx);
        }
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playSineWave(ctx) {
    const oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.connect(ctx.destination);
    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
        ctx.close();
    }, 500);
}

function playSquareWave(ctx) {
    const oscillator = ctx.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.connect(ctx.destination);
    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
        ctx.close();
    }, 300);
}

function playChimes(ctx) {
    const frequencies = [523, 659, 784]; // C, E, G
    let delay = 0;
    
    frequencies.forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = ctx.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
            oscillator.connect(ctx.destination);
            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
                if (index === frequencies.length - 1) {
                    ctx.close();
                }
            }, 400);
        }, delay);
        delay += 200;
    });
}

function playTriangleWave(ctx) {
    const oscillator = ctx.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(660, ctx.currentTime);
    oscillator.connect(ctx.destination);
    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
        ctx.close();
    }, 600);
}

function playSawtoothWave(ctx) {
    const oscillator = ctx.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    oscillator.connect(ctx.destination);
    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
        ctx.close();
    }, 400);
}

function playWavSound(soundType) {
    const soundFiles = {
        'wakey': 'sounds/460662__sergequadrado__wakey.wav',
        'digital': 'sounds/233645__zanox__alarm-clock-digital.wav',
        'distant': 'sounds/369879__splicesound__alarm-clock-beep-distant-perspective.wav'
    };
    
    const audioFile = soundFiles[soundType];
    if (audioFile) {
        const audio = new Audio(audioFile);
        audio.play().catch(e => {
            console.log('Failed to play WAV sound:', e);
        });
    }
}

function autoAdvanceToNextTimer(currentIndex) {
    // Find the next timer in the list that is not completed
    for (let i = currentIndex + 1; i < timers.length; i++) {
        const state = timerStates[i] || 'stopped';
        if (state === 'stopped' && timers[i].display !== 'Done!') {
            // Start the next available timer
            setTimeout(() => {
                startTimer(i);
                activeTimerIndex = i;
                // Scroll to the active timer
                const timerEl = document.querySelectorAll('.timer')[i];
                if (timerEl) {
                    timerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 1000); // Wait 1 second before starting the next timer
            return;
        }
    }
    // If no next timer found, optionally restart from the beginning
    // For now, just do nothing when reaching the end
}

// Event handlers
document.getElementById('addTimer').onclick = () => addTimer();

document.getElementById('toggleTheme').onclick = () => {
    document.body.classList.toggle('dark-theme');
};

document.getElementById('alarmSoundSelect').onchange = function() {
    selectedAlarmSound = this.value;
    localStorage.setItem('selectedAlarmSound', selectedAlarmSound);
};

document.getElementById('autoAdvanceToggle').onchange = function() {
    autoAdvanceEnabled = this.checked;
    localStorage.setItem('autoAdvanceEnabled', autoAdvanceEnabled);
};

function setThemeByPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setThemeByPreference);
setThemeByPreference();

// Load timers from URL if present
window.onload = () => {
    const urlTimers = getTimersFromUrl();
    if (urlTimers.length) {
        timers = urlTimers.map(t => ({ ...t, display: `${t.time}:00` }));
    } else {
        timers = [{ topic: '', time: 5, display: '5:00' }];
    }
    activeTimerIndex = 0;
    renderTimers();
    
    // Load saved alarm sound preference
    const savedSound = localStorage.getItem('selectedAlarmSound');
    if (savedSound) {
        selectedAlarmSound = savedSound;
        document.getElementById('alarmSoundSelect').value = savedSound;
    }
    
    // Load saved auto-advance preference
    const savedAutoAdvance = localStorage.getItem('autoAdvanceEnabled');
    if (savedAutoAdvance === 'true') {
        autoAdvanceEnabled = true;
        document.getElementById('autoAdvanceToggle').checked = true;
    }
};
