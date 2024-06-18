document.addEventListener('DOMContentLoaded', function () {
    let currentLang = ''; // Variable per mantenir l'idioma actual seleccionat
    let translations = {}; // Objecte per emmagatzemar les traduccions carregades
    let movieList = []; // Array per emmagatzemar la llista de pel·lícules
    let currentTeam = 1; // Variable per controlar l'equip actual
    let numTeams = 2; // Nombre d'equips per defecte
    let timeDuration = 10; // Durada del temps per defecte (en segons)

    // Elements de la UI
    const revealButton = document.getElementById('revealButton');
    const startButton = document.getElementById('startButton');
    const endButton = document.getElementById('endButton');
    const correctButton = document.getElementById('correctButton');
    const incorrectButton = document.getElementById('incorrectButton');
    const turnButton = document.getElementById('turnButton');
    const countdown = document.getElementById('countdown');
    const movieTitle = document.getElementById('movieTitle');
    const configSection = document.querySelector('.config');
    const applyConfigButton = document.getElementById('applyConfigButton');
    const cancelConfigButton = document.getElementById('cancelConfigButton');
    const helpButton = document.getElementById('helpButton');
    const helpModal = document.getElementById('helpModal');
    const helpText = document.getElementById('helpText');
    const closeButton = document.getElementById('closeButton');

    // Funció per canviar d'equip
    function switchTeam() {
        currentTeam = currentTeam < numTeams ? currentTeam + 1 : 1;
        updateTeamColors();
    }

    // Funció per actualitzar els colors dels equips
    function updateTeamColors() {
        const teamColors = ['#3498db', '#9b59b6', '#e67e22', '#e91e63'];
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

        const timer = setInterval(() => {
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

    // Event listener pel botó de tancar ajuda
    closeButton.addEventListener('click', () => {
        helpModal.classList.add('hidden');
    });

    // Funció per aplicar les traduccions segons l'idioma seleccionat
    function applyTranslations() {
        const elementsToTranslate = [
            document.getElementById('title'),
            revealButton,
            startButton,
            endButton,
            correctButton,
            incorrectButton,
            turnButton,
            applyConfigButton,
            cancelConfigButton,
            helpButton
        ];

        elementsToTranslate.forEach(element => {
            if (element instanceof HTMLElement) {
                const key = element.dataset.translationKey;
                if (key && translations[currentLang][key]) {
                    element.textContent = translations[currentLang][key];
                }
            }
        });

        // Aplicar traducció per als elements de la configuració
        document.getElementById('configTitle').textContent = translations[currentLang].config.title;
        document.getElementById('numTeamsLabel').textContent = translations[currentLang].config.numTeams;
        document.getElementById('timeDurationLabel').textContent = translations[currentLang].config.timeDuration;
        document.getElementById('numMoviesLabel').textContent = translations[currentLang].config.numMovies;
        document.getElementById('languageLabel').textContent = translations[currentLang].config.language;
        applyConfigButton.textContent = translations[currentLang].config.apply;
        cancelConfigButton.textContent = translations[currentLang].config.cancel;
        helpButton.textContent = translations[currentLang].config.help;
    }

    // Funció per obtenir una cookie per nom
    function getCookie(name) {
        const nameEQ = name + '=';
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

    // Funció per definir una cookie
    function setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }

    // Funció per carregar les traduccions des del fitxer JSON
    function loadTranslations() {
        fetch('translations.json')
            .then(response => response.json())
            .then(data => {
                translations = data;
                // Carregar l'idioma des de la cookie o detecció del navegador
                const savedLang = getCookie('language');
                currentLang = savedLang || (navigator.language.startsWith('es') ? 'es' : 'ca');
                languageSelect.value = currentLang;
                applyTranslations();
            })
            .catch(error => {
                console.error('Error carregant les traduccions:', error);
                alert('Error carregant les traduccions.');
            });
    }

    // Funció per carregar les traduccions des del fitxer JSON
    function fetchMovies() {
        fetch('https://pelismimic.github.io/movies.json')
        .then(response => response.json())
        .then(data => {
            movieList = data;
        })
        .catch(error => {
            console.error('Error carregant les pel·lícules:', error);
            alert('Error carregant les pel·lícules.');
        });
    }

    // Iniciar l'aplicació
    function init() {
        loadTranslations();
        fetchMovies();
        updateTeamColors();
    }

    // Iniciar l'aplicació quan el document estigui carregat
    init();
});
