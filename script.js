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
    const team1 = document.getElementById('team1');
    const team2 = document.getElementById('team2');
    let currentTitle = "";
    let currentTeam = 1;
    let timer;

    const switchTeam = () => {
        currentTeam = currentTeam === 1 ? 2 : 1;
    };

    const updateTeamHighlight = () => {
        if (currentTeam === 1) {
            team1.classList.add('highlight-equip1');
            team2.classList.remove('highlight-equip2');
        } else {
            team1.classList.remove('highlight-equip1');
            team2.classList.add('highlight-equip2');
        }
    };

    const showTurnButton = () => {
        turnButton.textContent = `Torn de l'Equip ${currentTeam}`;
        turnButton.classList.remove('hidden');
        revealButton.classList.add('hidden');
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

        let timeLeft = 10;
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

        if (currentTeam === 1) {
            score1.textContent = parseInt(score1.textContent) + 1;
        } else {
            score2.textContent = parseInt(score2.textContent) + 1;
        }

        switchTeam();
        showTurnButton();
    });

    // Iniciem el joc mostrant el botó de torn
    showTurnButton();
});
