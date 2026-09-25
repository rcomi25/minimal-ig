document.addEventListener('DOMContentLoaded', () => {
  const state = {
    timerSeconds: 600,
    remainingSeconds: 600,
    timerInterval: null,
    settings: JSON.parse(localStorage.getItem('minimal_ig_settings')) || {
      hideSuggested: true,
      hideLikes: false,
      hideStories: false,
      username: ''
    }
  };

  const timerDisplay = document.getElementById('timerDisplay');
  const startTimerBtn = document.getElementById('startTimerBtn');
  const timeBtns = document.querySelectorAll('.time-btn');
  const searchForm = document.getElementById('searchForm');
  const usernameInput = document.getElementById('usernameInput');
  const myProfileLink = document.getElementById('myProfileLink');
  
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const timeUpModal = document.getElementById('timeUpModal');
  const closeSessionBtn = document.getElementById('closeSessionBtn');
  const continueBtn = document.getElementById('continueBtn');

  const toggleSuggested = document.getElementById('toggleSuggested');
  const toggleLikes = document.getElementById('toggleLikes');
  const toggleStories = document.getElementById('toggleStories');
  const customUsername = document.getElementById('customUsername');

  toggleSuggested.checked = state.settings.hideSuggested;
  toggleLikes.checked = state.settings.hideLikes;
  toggleStories.checked = state.settings.hideStories;
  customUsername.value = state.settings.username || '';
  updateProfileLink();

  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const minutes = parseInt(btn.dataset.time, 10);
      state.timerSeconds = minutes * 60;
      state.remainingSeconds = state.timerSeconds;
      updateTimerDisplay();
    });
  });

  function updateTimerDisplay() {
    const mins = Math.floor(state.remainingSeconds / 60);
    const secs = state.remainingSeconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  startTimerBtn.addEventListener('click', () => {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
      startTimerBtn.textContent = 'Avvia Timer';
      return;
    }

    startTimerBtn.textContent = 'Pausa';
    state.timerInterval = setInterval(() => {
      if (state.remainingSeconds > 0) {
        state.remainingSeconds--;
        updateTimerDisplay();
      } else {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
        startTimerBtn.textContent = 'Avvia Timer';
        timeUpModal.classList.remove('hidden');
      }
    }, 1000);
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let query = usernameInput.value.trim().replace('@', '');
    if (query) {
      window.open(`https://www.instagram.com/${query}/`, '_blank');
    }
  });

  function updateProfileLink() {
    if (state.settings.username) {
      myProfileLink.href = `https://www.instagram.com/${state.settings.username}/`;
    } else {
      myProfileLink.href = `https://www.instagram.com/`;
    }
  }

  function saveSettings() {
    state.settings.hideSuggested = toggleSuggested.checked;
    state.settings.hideLikes = toggleLikes.checked;
    state.settings.hideStories = toggleStories.checked;
    state.settings.username = customUsername.value.trim().replace('@', '');
    
    localStorage.setItem('minimal_ig_settings', JSON.stringify(state.settings));
    updateProfileLink();
  }

  [toggleSuggested, toggleLikes, toggleStories].forEach(el => {
    el.addEventListener('change', saveSettings);
  });
  customUsername.addEventListener('input', saveSettings);

  settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
  closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
  
  closeSessionBtn.addEventListener('click', () => {
    timeUpModal.classList.add('hidden');
    state.remainingSeconds = state.timerSeconds;
    updateTimerDisplay();
  });

  continueBtn.addEventListener('click', () => {
    timeUpModal.classList.add('hidden');
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW Registration Failed:', err));
  }
});