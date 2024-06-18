document.addEventListener('DOMContentLoaded', function() {
    // Variables globals
    let currentTitle = '';
    let currentTeam = 1;
    let timer;
    let numTeams = 2;
    let timeDuration = 10;
    let currentLang = 'ca'; // Idioma per defecte és català

    // Selecció d'elements del DOM
    const movieTitle = document.getElementById('movieTitle');
    const countdown = document.getElementById('countdown');
    const turnButton = document.getElementById('turnButton');
    const revealButton = document.getElementById('revealButton');
    const startButton = document.getElementById('startButton');
    const endButton = document.getElementById('endButton');
    const correctButton = document.getElementById('correctButton');
    const incorrectButton = document.getElementById('incorrectButton');
    const configSection = document.getElementById('configSection');
    const applyConfigButton = document.getElementById('applyConfigButton');
    const cancelConfigButton = document.getElementById('cancelConfigButton');
    const helpButton = document.getElementById('helpButton');
    const helpModal = document.getElementById('helpModal');
    const helpText = document.getElementById('helpText');
    const closeButton = document.querySelector('.close-button');
    const numTeamsSelect = document.getElementById('numTeams');
    const timeDurationSelect = document.getElementById('timeDuration');
    const numMoviesSelect = document.getElementById('numMovies');
    const languageSelect = document.getElementById('language');

    // Configuració dels colors dels equips
    const teamColors = ['#007BFF', '#800080', '#FFA500', '#FFC0CB'];

    // Funció per canviar d'equip
    function switchTeam() {
        currentTeam = currentTeam < numTeams ? currentTeam + 1 : 1;
        updateTeamColors();
    }

    // Funció per actualitzar els colors dels equips
    function updateTeamColors() {
        const teams = document.querySelectorAll('.score');
        teams.forEach((team, index) => {
            team.style.borderColor = (index + 1 === currentTeam) ? teamColors[index] : 'transparent';
            team.style.backgroundColor = (index + 1 === currentTeam) ? teamColors[index] + '20' : 'rgba(0,0,0,0.1)';
        });
    }

    // Funció per mostrar el botó del torn actual i amagar la resta
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

    // Event listener pel botó de revelar pel·lícula
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

    // Event listener pel botó de començar
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
                new Audio('https://pelismimic.github.io/sirena.mp3').play();
            }
        }, 1000);
    });

    // Event listener pel botó d'acabar
    endButton.addEventListener('click', () => {
        clearInterval(timer);
        countdown.classList.add('hidden');
        movieTitle.classList.add('hidden');
        endButton.classList.add('hidden');
        revealButton.classList.remove('hidden');

        // Sumar punt a l'equip actual
        const scores = document.querySelectorAll('.score');
        scores[currentTeam - 1].textContent = parseInt(scores[currentTeam - 1].textContent) + 1;

        // Canviar a l'equip següent
        switchTeam();
        showTurnButton();
    });

    // Event listener pel botó de sumar 1 punt
    correctButton.addEventListener('click', () => {
        // Sumar punt a l'equip actual
        const scores = document.querySelectorAll('.score');
        scores[currentTeam - 1].textContent = parseInt(scores[currentTeam - 1].textContent) + 1;
        correctButton.classList.add('hidden');
        incorrectButton.classList.add('hidden');
        switchTeam();
        showTurnButton();
    });

    // Event listener pel botó de no acertat
    incorrectButton.addEventListener('click', () => {
        correctButton.classList.add('hidden');
        incorrectButton.classList.add('hidden');
        switchTeam();
        showTurnButton();
    });

    // Event listener pel botó de modificar configuració
    document.getElementById('modifyConfigButton').addEventListener('click', () => {
        configSection.classList.toggle('hidden');
    });

    // Event listener pel botó d'aplicar configuració
    applyConfigButton.addEventListener('click', () => {
        numTeams = parseInt(numTeamsSelect.value);
        timeDuration = parseInt(timeDurationSelect.value);
        const numMovies = parseInt(numMoviesSelect.value);
        currentLang = languageSelect.value;
        applyTranslations();

        // Guardar l'idioma seleccionat en una cookie
        setCookie('language', currentLang, 365);

        configSection.classList.add('hidden');

        // Reiniciar marcadors
        const scores = document.querySelectorAll('.score');
        scores.forEach(score => score.textContent = "0");

        // Mostrar/ocultar equips segons la configuració
        const teams = document.querySelectorAll('.score');
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

    // Event listener pel botó de cancel·lar configuració
    cancelConfigButton.addEventListener('click', () => {
        configSection.classList.add('hidden');
    });

    // Event listener pel botó d'ajuda
    helpButton.addEventListener('click', () => {
        helpText.textContent = translations[currentLang].helpText;
        helpModal.classList.remove('hidden');
    });

    // Event listener pel botó de tancar finestra modal d'ajuda
    closeButton.addEventListener('click', () => {
        helpModal.classList.add('hidden');
    });

    // Funció per aplicar les traduccions segons l'idioma seleccionat
    function applyTranslations() {
        if (!translations[currentLang]) return;
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
        helpButton.textContent = translations[currentLang].config.help;
    }

    // Assignar valors per defecte als selects
    numTeamsSelect.value = "2";
    timeDurationSelect.value = "10";
    numMoviesSelect.value = "4";

    showTurnButton();
});

// Funció per establir una cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Funció per obtenir el valor d'una cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}
