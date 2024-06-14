document.addEventListener('DOMContentLoaded', () => {
    const movieList = [
        "El Padrí",
        "Forrest Gump",
        "Titanic",
        "Gladiator",
        "Matrix",
        // Afegeix més pel·lícules aquí
    ];

    const startButton = document.getElementById('startButton');
    const movieTitle = document.getElementById('movieTitle');
    const countdown = document.getElementById('countdown');

    startButton.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * movieList.length);
        movieTitle.textContent = movieList[randomIndex];
        movieTitle.classList.remove('hidden');
        countdown.classList.remove('hidden');

        let timeLeft = 60;
        countdown.textContent = timeLeft;

        const timer = setInterval(() => {
            timeLeft--;
            countdown.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);
                countdown.textContent = "Temps acabat!";
            }
        }, 1000);
    });
});
