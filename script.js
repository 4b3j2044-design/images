const navLinks = document.querySelectorAll('.nav-menu a');
const sections = document.querySelectorAll('main section[id]');
const playToggle = document.getElementById('play-toggle');
const progressFill = document.getElementById('progress-fill');
const currentTime = document.getElementById('current-time');
const totalTime = document.getElementById('total-time');

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

function updateScrollSpy() {
  const offset = 120;
  let activeId = 'home';

  sections.forEach((section) => {
    const top = section.offsetTop - offset;
    const height = section.offsetHeight;

    if (window.scrollY >= top && window.scrollY < top + height) {
      activeId = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    const targetId = link.getAttribute('href');
    const isActive = targetId === `#${activeId}`;
    link.classList.toggle('active', isActive);
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}

window.addEventListener('scroll', updateScrollSpy, { passive: true });
window.addEventListener('load', updateScrollSpy);

const musicDuration = 165; // 2:45
let currentProgress = 0;
let isPlaying = false;
let timerId = null;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function setProgress(value) {
  const clamped = Math.min(Math.max(value, 0), 100);
  progressFill.style.width = `${clamped}%`;
  currentTime.textContent = formatTime((clamped / 100) * musicDuration);
}

function stopPlayback() {
  isPlaying = false;
  playToggle.textContent = '▶';
  playToggle.setAttribute('aria-label', '播放 Like 1');
  if (timerId) {
    cancelAnimationFrame(timerId);
  }
}

function startPlayback() {
  isPlaying = true;
  playToggle.textContent = '❚❚';
  playToggle.setAttribute('aria-label', '暫停 Like 1');

  const startTimestamp = performance.now();
  const durationMs = musicDuration * 1000;

  function tick(timestamp) {
    if (!isPlaying) return;
    const elapsed = timestamp - startTimestamp;
    const percent = Math.min((elapsed / durationMs) * 100, 100);
    setProgress(percent);

    if (percent < 100) {
      timerId = requestAnimationFrame(tick);
    } else {
      stopPlayback();
      setProgress(0);
    }
  }

  timerId = requestAnimationFrame(tick);
}

playToggle.addEventListener('click', () => {
  if (isPlaying) {
    stopPlayback();
  } else {
    startPlayback();
  }
});

totalTime.textContent = formatTime(musicDuration);
setProgress(0);
