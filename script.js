document.addEventListener('DOMContentLoaded', () => {
    let currentLang = 'ca';
    let translations = {};
    let movieList = [];
    let currentTeam = 1;
    let numTeams = 2;
    let timeLeft = 10;
    let countdownTimer;

    const revealButton = document.getElementById('revealButton');
    const startButton = document.getElementById('startButton');
    const endButton = document.getElementById('endButton');
    const correctButton = document.getElementById('correctButton');
    const incorrectButton = document.getElementById('incorrectButton');
    const turnButton = document.getElementById('turnButton');
    const applyConfigButton = document.getElementById('applyConfigButton');
    const cancelConfigButton = document.getElementById('cancelConfigButton');
    const modifyConfigButton = document.getElementById('modifyConfigButton');
    const helpButton = document.getElementById('helpButton');
    const closeButton = document.getElementById('closeButton');
    const helpModal = document.getElementById('helpModal');
    const movieTitle = document.getElementById('movieTitle');
    const countdown = document.getElementById('countdown');
    const languageSelect = document.getElementById('languageSelect');
    const numTeamsSelect = document.getElementById('numTeams');
    const timeDurationSelect = document.getElementById('timeDuration');
    const numMoviesSelect = document.getElementById('numMovies');
    const config = document.getElementById('config');
    const helpText = document.getElementById('helpText');

    function setLanguage(lang) {
        currentLang = lang;
        document.cookie = `language=${lang};path=/`;
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
        fetch('https://pelismimic.github.io/translations.json')
            .then(response => response.json())
            .then(data => {
                translations = data;
                const savedLang = document.cookie.replace(/(?:(?:^|.*;\s*)language\s*\=\s*([^;]*).*$)|^.*$/, "$1");
                setLanguage(savedLang || navigator.language.split('-')[0] || 'ca');
            })
            .catch(error => console.error('Error carregant les traduccions:', error));
    }

    function fetchMovies() {
        fetch('https://pelismimic.github.io/movies.json')
            .then(response => response.json())
            .then(data => {
                movieList = data;
            })
            .catch(error => console.error('Error carregant les pel·lícules:', error));
    }

    function showNextTeamButton() {
        turnButton.classList.remove('hidden');
        startButton.classList.add('hidden');
        revealButton.classList.add('hidden');
        correctButton.classList.add('hidden');
        incorrectButton.classList.add('hidden');
    }

    function startCountdown() {
        let timeLeft = parseInt(timeDurationSelect.value);
        countdown.textContent = timeLeft;
        countdownTimer = setInterval(() => {
            timeLeft -= 1;
            countdown.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdownTimer);
                countdown.textContent = '';
                playSound();
                correctButton.classList.remove('hidden');
                incorrectButton.classList.remove('hidden');
            }
        }, 1000);
    }

    function playSound() {
        const audio = new Audio('https://pelismimic.github.io/sirena.mp3');
        audio.play();
    }

    function switchTeam() {
        currentTeam = (currentTeam % numTeams) + 1;
        document.querySelectorAll('.score').forEach((score, index) => {
            if (index + 1 === currentTeam) {
                score.style.borderColor = getTeamColor(currentTeam);
            } else {
                score.style.borderColor = 'transparent';
            }
        });
    }

    function getTeamColor(teamNumber) {
        switch (teamNumber) {
            case 1:
                return '#3498db';
            case 2:
                return '#9b59b6';
            case 3:
                return '#e67e22';
            case 4:
                return '#e91e63';
            default:
                return '#000000';
        }
    }

    function resetGame() {
        document.querySelectorAll('.score').forEach(score => {
            score.textContent = '0';
            score.style.borderColor = 'transparent';
        });
        currentTeam = 1;
        switchTeam();
    }

    function showConfig() {
        config.classList.remove('hidden');
    }

    function hideConfig() {
        config.classList.add('hidden');
    }

    revealButton.addEventListener('click', () => {
        const randomMovie = movieList[Math.floor(Math.random() * movieList.length)];
        movieTitle.textContent = randomMovie;
        movieTitle.classList.remove('hidden');
        startButton.classList.remove('hidden');
        revealButton.classList.add('hidden');
    });

    startButton.addEventListener('click', () => {
        startCountdown();
        startButton.classList.add('hidden');
        endButton.classList.remove('hidden');
    });

    endButton.addEventListener('click', () => {
        clearInterval(countdownTimer);
        countdown.textContent = '';
        endButton.classList.add('hidden');
        correctButton.classList.remove('hidden');
        incorrectButton.classList.remove('hidden');
    });

    correctButton.addEventListener('click', () => {
        document.getElementById(`team${currentTeam}`).textContent =
            parseInt(document.getElementById(`team${currentTeam}`).textContent) + 1;
        correctButton.classList.add('hidden');
        incorrectButton.classList.add('hidden');
        showNextTeamButton();
        switchTeam();
    });

    incorrectButton.addEventListener('click', () => {
        correctButton.classList.add('hidden');
        incorrectButton.classList.add('hidden');
        showNextTeamButton();
        switchTeam();
    });

    turnButton.addEventListener('click', () => {
        revealButton.classList.remove('hidden');
        turnButton.classList.add('hidden');
    });

    applyConfigButton.addEventListener('click', () => {
        numTeams = parseInt(numTeamsSelect.value);
        timeLeft = parseInt(timeDurationSelect.value);
        resetGame();
        hideConfig();
    });

    cancelConfigButton.addEventListener('click', hideConfig);

    modifyConfigButton.addEventListener('click', showConfig);

    helpButton.addEventListener('click', () => {
        helpModal.classList.remove('hidden');
    });

    closeButton.addEventListener('click', () => {
        helpModal.classList.add('hidden');
    });

    languageSelect.addEventListener('change', () => {
        setLanguage(languageSelect.value);
    });

    fetchTranslations();
    fetchMovies();
    resetGame();
});
