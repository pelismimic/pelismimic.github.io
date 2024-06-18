document.addEventListener('DOMContentLoaded', () => {
    let movieList = [];

    // Carregar la llista de pel·lícules des del fitxer JSON
    fetch('https://pelismimic.github.io/movies.json')
        .then(response => response.json())
        .then(data => {
            movieList = data;
        })
        .catch(error => console.error('Error carregant les pel·lícules:', error));

    const revealButton = document.getElementById('revealButton');
    const startButton = document.getElementById('startButton');
    const endButton = document.getElementById('endButton');
    const turnButton = document.getElementById('turnButton');
    const movieTitle = document.getElementById('movieTitle');
    const countdown = document.getElementById('countdown');
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
    const modifyConfigButton = document.getElementById('modifyConfigButton');
    const applyConfigButton = document.getElementById('applyConfigButton');
    const configSection = document.getElementById('configSection');
    let currentTitle = "";
    let currentTeam = 1;
    let timer;
    let timeDuration = 10;
    let numTeams = 2;

    const teams = [team1, team2, team3, team4];
    const scores = [score1, score2, score3, score4];

    const switchTeam = () => {
        currentTeam = currentTeam === numTeams ? 1 : currentTeam + 1;
    };

    const updateTeamHighlight = () => {
        teams.forEach((team, index) => {
            team.classList.remove('highlight-equip1', 'highlight-equip2', 'highlight-equip3', 'highlight-equip4');
            if (index + 1 === currentTeam) {
                team.classList.add(`highlight-equip${currentTeam}`);
            }
        });
    };

    const showTurnButton = () => {
        turnButton.textContent = `Torn de l'Equip ${currentTeam}`;
        turnButton.classList.remove('hidden');
        revealButton.classList.add('hidden');
        countdown.classList.add('hidden');  // Amagar el missatge de "temps acabat"
        updateTeamHighlight();
    };

    turnButton.addEventListener('click', () => {
        turnButton.classList.add('hidden');
        revealButton.classList.remove('hidden');
        updateTeamHighlight();
    });

    revealButton.addEventListener('click', () => {
        if (movieList.length > 0) {
            const randomIndex = Math.floor(Math.random() * movieList.length);
            currentTitle = movieList[randomIndex];
            movieTitle.textContent = currentTitle;
            movieTitle.classList.remove('hidden');
            startButton.classList.remove('hidden');
            revealButton.classList.add('hidden');
            endButton.classList.add('hidden');
            countdown.classList.add('hidden');
            clearInterval(timer);
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
                switchTeam();
                showTurnButton();
                new Audio('https://www.soundjay.com/button/beep-07.wav').play();  // Avisa que el temps ha acabat
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

    // Mostrar i ocultar la secció de configuració
    modifyConfigButton.addEventListener('click', () => {
        configSection.classList.toggle('hidden');
    });

    // Aplicar configuració
    applyConfigButton.addEventListener('click', () => {
        numTeams = parseInt(numTeamsSelect.value);
        timeDuration = parseInt(timeDurationSelect.value);
        const numMovies = parseInt(numMoviesSelect.value);

        // Ocultar secció de configuració
        configSection.classList.add('hidden');

        // Reiniciar marcadors
        scores.forEach(score => score.textContent = "0");

        // Mostrar/ocultar equips segons la configuració
        teams.forEach((team, index) => {
            if (index < numTeams) {
                team.classList.remove('hidden');
            } else {
                team.classList.add('hidden');
            }
        });

        // Reiniciar el joc
        currentTeam = 1;
        showTurnButton();
    });

    // Valors per defecte
    numTeamsSelect.value = "2";
    timeDurationSelect.value = "10";
    numMoviesSelect.value = "4";

    // Iniciem el joc mostrant el botó de torn
    showTurnButton();
});
