document.addEventListener('DOMContentLoaded', () => {
    let movieList = [];
    let translations = {};
    let currentLang = 'ca';

    // Carregar pel·lícules
    fetch('https://pelismimic.github.io/movies.json')
        .then(response => response.json())
        .then(data => {
            movieList = data;
        })
        .catch(error => console.error('Error carregant les pel·lícules:', error));

    // Carregar traduccions
    fetch('https://pelismimic.github.io/translations.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            applyTranslations();
        })
        .catch(error => console.error('Error carregant les traduccions:', error));

    const revealButton = document.getElementById('revealButton');
    const startButton = document.getElementById('startButton');
    const endButton = document.getElementById('endButton');
    const turnButton = document.getElementById('turnButton');
    const movieTitle = document.getElementById('movieTitle');
    const countdown = document.getElementById('countdown');
    const correctButton = document.getElementById('correctButton');
    const incorrectButton = document.getElementById('incorrectButton');
    const score1 = document.getElementById('score1');
    const score2 = document.getElementById('score2');
    const score3 = document.getElementById('score3');
    const score4 = document.getElementById('score4');
    const team1 = document.getElementById('team1');
    const team2 = document.getElementById('team2');
    const team3 = document.getElementById('team3');
    const team4 = document.getElementById('team4');
    const numTeamsSelect = document.getElementById('numTeams');
    const timeDurationSelect = document.getElementById('timeDuration');
    const numMoviesSelect = document.getElementById('numMovies');
    const languageSelect = document.getElementById('language');
    const modifyConfigButton = document.getElementById('modifyConfigButton');
    const applyConfigButton = document.getElementById('applyConfigButton');
    const cancelConfigButton = document.getElementById('cancelConfigButton');
    const configSection = document.getElementById('configSection');
    let currentTitle = "";
    let currentTeam = 1;
    let timer;
    let timeDuration = 10;
    let numTeams = 2;

    const teams = [team1, team2, team3, team4];
    const scores = [score1, score2, score3, score4];

    function switchTeam() {
        currentTeam = currentTeam % numTeams + 1;
        highlightCurrentTeam();
    }

    function highlightCurrentTeam() {
        teams.forEach((team, index) => {
            team.classList.remove('highlight-equip1', 'highlight-equip2', 'highlight-equip3', 'highlight-equip4');
            if (index + 1 === currentTeam) {
                team.classList.add(`highlight-equip${currentTeam}`);
            }
        });
    }

    function showTurnButton() {
        turnButton.textContent = `${translations[currentLang].turnButton} ${currentTeam}`;
        turnButton.classList.remove('hidden');
        revealButton.classList.add('hidden');
        startButton.classList.add('hidden');
        endButton.classList.add('hidden');
        correctButton.classList.add('hidden');
        incorrectButton.classList.add('hidden');
        movieTitle.classList.add('hidden');
        countdown.classList.add('hidden');
    }

    revealButton.addEventListener('click', () => {
        if (movieList.length > 0) {
            currentTitle = movieList[Math.floor(Math.random() * movieList.length)];
            movieTitle.textContent = currentTitle;
            movieTitle.classList.remove('hidden');
            revealButton.classList.add('hidden');
            startButton.classList.remove('hidden');
        } else {
            alert('Encara no s\'ha carregat la llista de pel·lícules.');
        }
    });

    startButton.addEventListener('click', () => {
        countdown.classList.remove('hidden');
        startButton.classList.add('hidden');
        endButton.classList.remove('hidden');

        let timeLeft = timeDuration;
        countdown.textContent = timeLeft;

        timer = setInterval(() => {
            timeLeft--;
            countdown.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);
                countdown.textContent = "Temps acabat!";
                endButton.classList.add('hidden');
                movieTitle.classList.add('hidden');
                correctButton.classList.remove('hidden');
                incorrectButton.classList.remove('hidden');
                new Audio('https://www.soundjay.com/button/beep-07.wav').play();
            }
        }, 1000);
    });

    endButton.addEventListener('click', () => {
        clearInterval(timer);
        countdown.classList.add('hidden');
        movieTitle.classList.add('hidden');
        endButton.classList.add('hidden');
        revealButton.classList.remove('hidden');

        scores[currentTeam - 1].textContent = parseInt(scores[currentTeam - 1].textContent) + 1;

        switchTeam();
        showTurnButton();
    });

    correctButton.addEventListener('click', () => {
        scores[currentTeam - 1].textContent = parseInt(scores[currentTeam - 1].textContent) + 1;
        correctButton.classList.add('hidden');
        incorrectButton.classList.add('hidden');
        switchTeam();
        showTurnButton();
    });

    incorrectButton.addEventListener('click', () => {
        correctButton.classList.add('hidden');
        incorrectButton.classList.add('hidden');
        switchTeam();
        showTurnButton();
    });

    modifyConfigButton.addEventListener('click', () => {
        configSection.classList.toggle('hidden');
    });

    applyConfigButton.addEventListener('click', () => {
        numTeams = parseInt(numTeamsSelect.value);
        timeDuration = parseInt(timeDurationSelect.value);
        const numMovies = parseInt(numMoviesSelect.value);
        currentLang = languageSelect.value;
        applyTranslations();

        configSection.classList.add('hidden');

        scores.forEach(score => score.textContent = "0");

        teams.forEach((team, index) => {
            if (index < numTeams) {
                team.classList.remove('hidden');
            } else {
                team.classList.add('hidden');
            }
        });

        currentTeam = 1;
        showTurnButton();
    });

    cancelConfigButton.addEventListener('click', () => {
        configSection.classList.add('hidden');
    });

    function applyTranslations() {
        document.getElementById('title').textContent = translations[currentLang].title;
        revealButton.textContent = translations[currentLang].revealButton;
        startButton.textContent = translations[currentLang].startButton;
        endButton.textContent = translations[currentLang].endButton;
        correctButton.textContent = translations[currentLang].correctButton;
        incorrectButton.textContent = translations[currentLang].incorrectButton;
        turnButton.textContent = `${translations[currentLang].turnButton} ${currentTeam}`;
        
        document.querySelector('.config h2').textContent = translations[currentLang].config.title;
        document.querySelector('label[for="numTeams"]').textContent = translations[currentLang].config.numTeams;
        document.querySelector('label[for="timeDuration"]').textContent = translations[currentLang].config.timeDuration;
        document.querySelector('label[for="numMovies"]').textContent = translations[currentLang].config.numMovies;
        document.querySelector('label[for="language"]').textContent = translations[currentLang].config.language;
        applyConfigButton.textContent = translations[currentLang].config.apply;
        cancelConfigButton.textContent = translations[currentLang].config.cancel;
    }

    numTeamsSelect.value = "2";
    timeDurationSelect.value = "10";
    numMoviesSelect.value = "4";

    showTurnButton();
});
