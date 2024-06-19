document.addEventListener('DOMContentLoaded', () => {
    let translations = {};
    let movieList = [];
    let currentLang = 'ca';
    let currentTeam = 1;
    let numTeams = 2;
    let countdownTimer;

    const modifyConfigButton = document.getElementById('modifyConfigButton');
    const helpButton = document.getElementById('helpButton');
    const closeButton = document.getElementById('closeButton');
    const applyConfigButton = document.getElementById('applyConfigButton');
    const cancelConfigButton = document.getElementById('cancelConfigButton');
    const turnButton = document.getElementById('turnButton');
    const revealButton = document.getElementById('revealButton');
    const startButton = document.getElementById('startButton');
    const endButton = document.getElementById('endButton');
    const correctButton = document.getElementById('correctButton');
    const incorrectButton = document.getElementById('incorrectButton');
    const countdown = document.getElementById('countdown');
    const movieTitle = document.getElementById('movieTitle');
    const languageSelect = document.getElementById('languageSelect');
    const numTeamsSelect = document.getElementById('numTeams');
    const timeDurationSelect = document.getElementById('timeDuration');
    const numMoviesSelect = document.getElementById('numMovies');
    const config = document.getElementById('config');
    const helpModal = document.getElementById('helpModal');
    const helpText = document.getElementById('helpText');

    function setLanguage(lang) {
        currentLang = lang;
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `language=${lang};expires=${expiryDate.toUTCString()};path=/;SameSite=Lax;Secure`;
        translatePage();
    }

    function translatePage() {
        document.querySelectorAll('[data-translation-key]').forEach(element => {
            const key = element.getAttribute('data-translation-key');
            if (translations[currentLang] && translations[currentLang][key]) {
                element.textContent = translations[currentLang][key];
            }
        });
    }

    function fetchTranslations() {
        fetch('https://pelismimic.github.io/tranduccions.json')
            .then(response => response.json())
            .then(data => {
                translations = data;
                const savedLang = document.cookie.replace(/(?:(?:^|.*;\s*)language\s*\=\s*([^;]*).*$)|^.*$/, "$1");
                setLanguage(savedLang || navigator.language.split('-')[0] || 'ca');
            })
            .catch(error => console.error('Error carregant les traduccions:', error));
    }

    function fetchMovies() {
        fetch('https://pelismimic.github.io/pelicules.json')
            .then(response => response.json())
            .then(data => {
                movieList = data;
            })
            .catch(error => console.error('Error carregant les pel·lícules:', error));
    }

    function toggleConfig(show) {
        config.classList.toggle('hidden', !show);
        modifyConfigButton.classList.toggle('hidden', show);
        helpButton.classList.toggle('hidden', show);
    }

    function toggleHelp(show) {
        helpModal.classList.toggle('hidden', !show);
    }

    function updateScores() {
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`team${i}`).classList.toggle('highlight', i === currentTeam);
            document.getElementById(`team${i}`).classList.toggle(`team${i}`, i === currentTeam);
        }
    }

    function switchTurn() {
        currentTeam = (currentTeam % numTeams) + 1;
        updateScores();
        turnButton.textContent = `${translations[currentLang]['turnButton']} ${currentTeam}`;
        turnButton.className = `team${currentTeam}`;
    }

    function startCountdown(duration) {
        let time = duration;
        countdown.textContent = time;
        countdown.classList.remove('hidden');

        countdownTimer = setInterval(() => {
            time -= 1;
            countdown.textContent = time;
            if (time <= 0) {
                clearInterval(countdownTimer);
                new Audio('https://pelismimic.github.io/sirena.mp3').play();
                countdown.classList.add('hidden');
                endButton.classList.add('hidden');
                correctButton.classList.remove('hidden');
                incorrectButton.classList.remove('hidden');
            }
        }, 1000);
    }

    modifyConfigButton.addEventListener('click', () => toggleConfig(true));
    cancelConfigButton.addEventListener('click', () => toggleConfig(false));
    applyConfigButton.addEventListener('click', () => {
        numTeams = parseInt(numTeamsSelect.value);
        const duration = parseInt(timeDurationSelect.value);
        const numMovies = parseInt(numMoviesSelect.value);
        setLanguage(languageSelect.value);
        toggleConfig(false);
        switchTurn();
    });

    helpButton.addEventListener('click', () => toggleHelp(true));
    closeButton.addEventListener('click', () => toggleHelp(false));

    turnButton.addEventListener('click', () => {
        turnButton.classList.add('hidden');
        revealButton.classList.remove('hidden');
        startButton.classList.add('hidden');
        endButton.classList.add('hidden');
    });

    revealButton.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * movieList.length);
        movieTitle.textContent = movieList[randomIndex];
        movieTitle.classList.remove('hidden');
        revealButton.classList.add('hidden');
        startButton.classList.remove('hidden');
    });

    startButton.addEventListener('click', () => {
        const duration = parseInt(timeDurationSelect.value);
        startCountdown(duration);
        startButton.classList.add('hidden');
        endButton.classList.remove('hidden');
    });

    endButton.addEventListener('click', () => {
        clearInterval(countdownTimer);
        countdown.classList.add('hidden');
        endButton.classList.add('hidden');
        correctButton.classList.remove('hidden');
        incorrectButton.classList.remove('hidden');
    });

    correctButton.addEventListener('click', () => {
        const teamScore = document.getElementById(`team${currentTeam}`);
        teamScore.textContent = parseInt(teamScore.textContent) + 1;
        correctButton.classList.add('hidden');
        incorrectButton.classList.add('hidden');
        turnButton.classList.remove('hidden');
        movieTitle.classList.add('hidden');
        switchTurn();
    });

    incorrectButton.addEventListener('click', () => {
        correctButton.classList.add('hidden');
        incorrectButton.classList.add('hidden');
        turnButton.classList.remove('hidden');
        movieTitle.classList.add('hidden');
        switchTurn();
    });

    fetchTranslations();
    fetchMovies();
});
