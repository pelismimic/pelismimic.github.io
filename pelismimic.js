document.addEventListener('DOMContentLoaded', () => {
    let translations = {};
    let movieList = [];
    let currentLang = 'ca';
    let equipActual = 1;
    let nombreEquips = 2;
    let compteEnreraTimer;

    const botoConfiguracio = document.getElementById('botoConfiguracio');
    const botoAjuda = document.getElementById('botoAjuda');
    const botoTancarAjuda = document.getElementById('botoTancarAjuda');
    const botoModifConfig = document.getElementById('botoModifConfig');
    const botoCancelConfig = document.getElementById('botoCancelConfig');
    const turnMessage = document.getElementById('turnMessage');
    const revealButton = document.getElementById('revealButton');
    const startButton = document.getElementById('startButton');
    const endButton = document.getElementById('endButton');
    const correctButton = document.getElementById('correctButton');
    const incorrectButton = document.getElementById('incorrectButton');
    const compteEnrera = document.getElementById('compteEnrera');
    const movieTitle = document.getElementById('movieTitle');
    const selectorIdioma = document.getElementById('selectorIdioma');
    const nombreEquipsSelect = document.getElementById('nombreEquips');
    const timeDurationSelect = document.getElementById('timeDuration');
    const nombrePeliculesSelect = document.getElementById('nombrePelicules');
    const config = document.getElementById('config');
    const AjudaModal = document.getElementById('AjudaModal');
    const AjudaText = document.getElementById('AjudaText');

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
        // Set language options
        document.querySelector('option[value="ca"]').textContent = translations[currentLang]['catala'];
        document.querySelector('option[value="es"]').textContent = translations[currentLang]['castella'];
        document.querySelector('option[value="en"]').textContent = translations[currentLang]['Angles'];
        document.querySelector('option[value="fr"]').textContent = translations[currentLang]['french'];    
    }

    function loadMovieTitle(movie) {
        const title = movie[currentLang] || movie['ca'];
        document.getElementById('movieTitle').textContent = title;
    }

    function fetchTranslations() {
        //fetch('https://pelismimic.github.io/traduccions.json')
        fetch('./traduccions.json')
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

    function conmutaConfiguracio(show) {
        configuracioModal.classList.toggle('hidden', !show);
        botoConfiguracio.classList.toggle('hidden', show);
        botoAjuda.classList.toggle('hidden', show);
    }


    function conmutaAjuda(show) {
        AjudaModal.classList.toggle('hidden', !show);
        botoConfiguracio.classList.toggle('hidden', show);
        botoAjuda.classList.toggle('hidden', show);
    }

    function updateScores() {
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`team${i}`).classList.toggle('highlight', i === equipActual);
            document.getElementById(`team${i}`).classList.toggle(`team${i}`, i === equipActual);
        }
    }

    function canviaTorn() {
        equipActual = (equipActual % nombreEquips) + 1;
        updateScores();
        turnMessage.textContent = `Torn de l'equip ${equipActual + 1}`;
        turnMessage.className = `team${equipActual}`;
    }

    function iniciaPartida() {
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`team${i}`).textContent = "0"
        }
        equipActual = nombreEquips;
    }

    function startCountdown(duration) {
        let time = duration;
        compteEnrera.textContent = time;
        compteEnrera.classList.remove('hidden');

        compteEnreraTimer = setInterval(() => {
            time -= 1;
            compteEnrera.textContent = time;
            if (time <= 0) {
                clearInterval(compteEnreraTimer);
                new Audio('https://pelismimic.github.io/sirena.mp3').play();
                compteEnrera.classList.add('hidden');
                endButton.classList.add('hidden');
                correctButton.classList.remove('hidden');
                incorrectButton.classList.remove('hidden');
            }
        }, 1000);
    }

    botoConfiguracio.addEventListener('click', () => conmutaConfiguracio(true));
    botoCancelConfig.addEventListener('click', () => conmutaConfiguracio(false));
    botoModifConfig.addEventListener('click', () => {
        nombreEquips = parseInt(nombreEquipsSelect.value);
        const duration = parseInt(timeDurationSelect.value);
        const nombrePelicules = parseInt(nombrePeliculesSelect.value);
        setLanguage(selectorIdioma.value);
        conmutaConfiguracio(false);
        iniciaPartida();
    });

    botoAjuda.addEventListener('click', () => conmutaAjuda(true));
    botoTancarAjuda.addEventListener('click', () => conmutaAjuda(false));

    turnMessage.addEventListener('click', () => {
        //turnButton.classList.add('hidden');
        //revealButton.classList.remove('hidden');
        startButton.classList.add('hidden');
        endButton.classList.add('hidden');
    });

    revealButton.addEventListener('click', () => {
        currentMovieIndex = (currentMovieIndex + 1) % movieList.length;
        loadMovieTitle(movieList[currentMovieIndex]);
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
        clearInterval(compteEnreraTimer);
        compteEnrera.classList.add('hidden');
        endButton.classList.add('hidden');
        correctButton.classList.remove('hidden');
        incorrectButton.classList.remove('hidden');
    });

    correctButton.addEventListener('click', () => {
        const teamScore = document.getElementById(`team${equipActual}`);
        teamScore.textContent = parseInt(teamScore.textContent) + 1;
        correctButton.classList.add('hidden');
        incorrectButton.classList.add('hidden');
        turnMessage.classList.remove('hidden');
        movieTitle.classList.add('hidden');
        canviaTorn();
    });

    incorrectButton.addEventListener('click', () => {
        correctButton.classList.add('hidden');
        incorrectButton.classList.add('hidden');
        turnMessage.classList.remove('hidden');
        movieTitle.classList.add('hidden');
        canviaTorn();
    });

    fetchTranslations();
    fetchMovies();
    iniciaPartida();
});
