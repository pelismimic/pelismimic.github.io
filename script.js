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
    const movieTitle = document.getElementById('movieTitle');
    const countdown = document.getElementById('countdown');
    const score1 = document.getElementById('score1');
    const score2 = document.getElementById('score2');
    let currentTitle = "";
    let timer;

    revealButton.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * movieList.length);
        currentTitle = movieList[randomIndex];
        movieTitle.textContent = currentTitle;
        movieTitle.classList.remove('hidden');
        startButton.classList.remove('hidden');
        countdown.classList.add('hidden');
        clearInterval(timer);
    });

    startButton.addEventListener('click', () => {
        countdown.classList.remove('hidden');
        startButton.classList.add('hidden');

        let timeLeft = 60;
        countdown.textContent = timeLeft;

        timer = setInterval(() => {
            timeLeft--;
            countdown.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);
                countdown.textContent = "Temps acabat!";
                movieTitle.classList.add('hidden');
            }
        }, 1000);
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
