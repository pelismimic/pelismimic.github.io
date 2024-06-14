document.addEventListener('DOMContentLoaded', () => {
    const movieList = [
        "El Padrí",
        "Forrest Gump",
        "Titanic",
        "Gladiator",
        "Matrix",
        // Afegeix més pel·lícules aquí
    ];

    const revealButton = document.getElementById('revealButton');
    const startButton = document.getElementById('startButton');
    const endButton = document.getElementById('endButton');
    const movieTitle = document.getElementById('movieTitle');
    const countdown = document.getElementById('countdown');
    const score1 = document.getElementById('score1');
    const score2 = document.getElementById('score2');
    let currentTitle = "";
    let currentTeam = 1;
    let timer;

    const switchTeam = () => {
        currentTeam = currentTeam === 1 ? 2 : 1;
    };

    const updateCountdownColor = () => {
        if (currentTeam === 1) {
            countdown.classList.add('equip1');
            countdown.classList.remove('equip2');
        } else {
            countdown.classList.add('equip2');
            countdown.classList.remove('equip1');
        }
    };

    revealButton.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * movieList.length);
        currentTitle = movieList[randomIndex];
        movieTitle.textContent = currentTitle;
        movieTitle.classList.remove('hidden');
        startButton.classList.remove('hidden');
        endButton.classList.add('hidden');
        countdown.classList.add('hidden');
        clearInterval(timer);
    });

    startButton.addEventListener('click', () => {
        countdown.classList.remove('hidden');
        startButton.classList.add('hidden');
        endButton.classList.remove('hidden');
        updateCountdownColor();

        let timeLeft = 60;
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
                new Audio('https://www.soundjay.com/button/beep-07.wav').play();  // Avisa que el temps ha acabat
            }
        }, 1000);
    });

    endButton.addEventListener('click', () => {
        clearInterval(timer);
        countdown.classList.add('hidden');
        movieTitle.classList.add('hidden');
        endButton.classList.add('hidden');

        if (currentTeam === 1) {
            score1.textContent = parseInt(score1.textContent) + 1;
        } else {
            score2.textContent = parseInt(score2.textContent) + 1;
        }

        switchTeam();
    });

    const addPoint = (team) => {
        if (team === 1) {
            score1.textContent = parseInt(score1.textContent) + 1;
        } else if (team === 2) {
            score2.textContent = parseInt(score2.textContent) + 1;
        }
        movieTitle.classList.add('hidden');
        countdown.classList.add('hidden');
        startButton.classList.add('hidden');
        clearInterval(timer);
    };

    // Exemple de com podries incrementar els punts (pot ser adaptat segons la teva lògica de joc)
    document.addEventListener('keydown', (e) => {
        if (e.key === '1') {
            addPoint(1);
        } else if (e.key === '2') {
            addPoint(2);
        }
    });
});
