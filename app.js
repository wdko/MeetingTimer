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
    const timers = Array.from(document.querySelectorAll('.timer')).map(timerEl => {
        return {
            topic: timerEl.querySelector('input[type="text"]').value,
            time: timerEl.querySelector('input[type="number"]').value
        };
    });
    const params = timers.map((t, i) => `topic${i}=${encodeURIComponent(t.topic)}&time${i}=${t.time}`).join('&');
    const url = `${window.location.origin}${window.location.pathname}?${params}`;
    document.getElementById('shareInput').value = url;
}

function addTimer(topic = '', time = 5) {
    const timersDiv = document.getElementById('timers');
    const timerEl = document.createElement('div');
    timerEl.className = 'timer';
    timerEl.innerHTML = `
        <div class="timer-options">
            <input type="text" placeholder="Topic" value="${topic}" />
            <input type="number" min="1" value="${time}" />
        </div>
        <span class="countdown">${time}:00</span>
        <div class="timer-actions">
            <button class="start">Start</button>
            <button class="remove">Remove</button>
        </div>
    `;
    timersDiv.appendChild(timerEl);

    timerEl.querySelector('.remove').onclick = () => {
        timerEl.remove();
        updateShareUrl();
        renderActiveTimer();
    };
    timerEl.querySelector('input[type="text"]').oninput = () => { updateShareUrl(); renderActiveTimer(); };
    timerEl.querySelector('input[type="number"]').oninput = function() {
        timerEl.querySelector('.countdown').textContent = `${this.value}:00`;
        updateShareUrl();
        renderActiveTimer();
    };
    timerEl.querySelector('.start').onclick = function() {
        startCountdown(timerEl);
    };
    updateShareUrl();
    renderActiveTimer();
}


let timers = [];
let activeTimerIndex = 0;

function renderTimers() {
    const timersDiv = document.getElementById('timers');
    timersDiv.innerHTML = '';
    timers.forEach((timer, i) => {
        const timerEl = document.createElement('div');
    timerEl.className = 'timer';
        timerEl.innerHTML = `
            <div class="timer-options">
                <input id="topic-${i}" type="text" placeholder="Topic" value="${timer.topic}" />
                <input id="time-${i}" type="number" min="1" value="${timer.time}" />
            </div>
            <span class="countdown">${timer.display || `${timer.time}:00`}</span>
            <div class="timer-actions">
                <button class="start">Start</button>
                <button class="remove">Remove</button>
            </div>
        `;
        // Remove timer
        timerEl.querySelector('.remove').onclick = (e) => {
            e.stopPropagation();
            timers.splice(i, 1);
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
            renderTimers();
            updateShareUrl();
        };
        // Start timer
        timerEl.querySelector('.start').onclick = function(e) {
            e.stopPropagation();
            startCountdown(timerEl, i);
        };
        // Select timer
        timerEl.onclick = () => {
            activeTimerIndex = i;
            //renderTimers();
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

function startCountdown(timerEl, i) {
    let seconds = parseInt(timers[i].time, 10) * 60;
    const countdownEl = timerEl.querySelector('.countdown');
    timerEl.querySelector('.start').disabled = true;
    const interval = setInterval(() => {
        if (seconds <= 0) {
            clearInterval(interval);
            countdownEl.textContent = 'Done!';
            timerEl.querySelector('.start').disabled = false;
            playEndSound();
            timers[i].display = 'Done!';
            return;
        }
        seconds--;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        countdownEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
        timers[i].display = countdownEl.textContent;
    }, 1000);
}

document.getElementById('addTimer').onclick = () => addTimer();

document.getElementById('toggleTheme').onclick = () => {
    document.body.classList.toggle('dark-theme');
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
};

document.getElementById('prevTimer').onclick = () => {
    const timerEls = document.querySelectorAll('.timer');
    if (timerEls.length === 0) return;
    activeTimerIndex = (activeTimerIndex - 1 + timerEls.length) % timerEls.length;
    renderActiveTimer();
};
// Optionally, add click to select timer
document.getElementById('timers').onclick = (e) => {
    const timerEls = Array.from(document.querySelectorAll('.timer'));
    const clicked = timerEls.findIndex(el => el.contains(e.target));
    if (clicked !== -1) {
        activeTimerIndex = clicked;
        renderActiveTimer();
    }
};

function startCountdown(timerEl) {
    let seconds = parseInt(timerEl.querySelector('input[type="number"]').value, 10) * 60;
    const countdownEl = timerEl.querySelector('.countdown');
    timerEl.querySelector('.start').disabled = true;
    const interval = setInterval(() => {
        if (seconds <= 0) {
            clearInterval(interval);
            countdownEl.textContent = 'Done!';
            timerEl.querySelector('.start').disabled = false;
            playEndSound();
            return;
        }
        seconds--;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        countdownEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }, 1000);
}

function playEndSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
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

document.getElementById('addTimer').onclick = () => addTimer();

document.getElementById('toggleTheme').onclick = () => {
    document.body.classList.toggle('dark-theme');
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
// window.onload = () => {
//     const timers = getTimersFromUrl();
//     if (timers.length) {
//         timers.forEach(t => addTimer(t.topic, t.time));
//     } else {
//         addTimer();
//     }
//     renderActiveTimer();
// };
