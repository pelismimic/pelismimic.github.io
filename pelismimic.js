document.addEventListener('DOMContentLoaded', () => {
    let nombreEquipsMax = 6;
    let nombreEquipsInicial = 2;
    let idiomaInicial = 'ca';
    let peliculesInicial = 5;
    let tempsInicial = 60;
    let nomCookie = 'pelismimic';
    let debug = true;

    let translations = {};
    let movieList = [];
    let idiomaActual = idiomaInicial;
    let nombreEquips = nombreEquipsInicial;
    let equipActual = 1;
    let compteEnreraTimer;

    const pantallaJoc = document.getElementById('pantallaJoc');
    const botoConfiguracio = document.getElementById('botoConfiguracio');
    const botoAjuda = document.getElementById('botoAjuda');
    const botoModifConfig = document.getElementById('botoModifConfig');
    const botoCancelConfig = document.getElementById('botoCancelConfig');
    const turnMessage = document.getElementById('turnMessage');
    const botoRevelarPelicula = document.getElementById('botoRevelarPelicula');
    const botoComençar = document.getElementById('botoComençar');
    //const endButton = document.getElementById('endButton');
    const botoRespostaCorrecta = document.getElementById('botoRespostaCorrecta');
    const botoRespostaIncorrecta = document.getElementById('botoRespostaIncorrecta');
    const compteEnrera = document.getElementById('compteEnrera');
    const titolPelicula = document.getElementById('titolPelicula');
    const selectorIdioma = document.getElementById('selectorIdioma');
    const nombreEquipsSelect = document.getElementById('nombreEquips');
    const timeDurationSelect = document.getElementById('timeDuration');
    const nombrePeliculesSelect = document.getElementById('nombrePelicules');
    const config = document.getElementById('config'); 
    const modalAjuda = document.getElementById('modalAjuda');
    const textAjuda = document.getElementById('textAjuda'); // cal?
    const botoTancarAjuda = document.getElementById('botoTancarAjuda');
    const debugMissatge = document.getElementById('debugMissatge');
   
    function montarDebugMissatge() {
        const dataihora = new Date();
        debugMissatge.textContent = dataihora.toUTCString() + " | equips:" + nombreEquips + " | temps:" + timeDurationSelect.value + 
        " | pelis:" + nombrePeliculesSelect.value + " | idioma:" + selectorIdioma.value + " | equipActual:" + equipActual;
  
        missatgeConsola(debugMissatge.textContent);
    }

    function missatgeConsola(text) {
        console.log(text);
    }

    function estableixCookie() {
        esborraCookie(); 
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        const valors = {
            idioma: idiomaActual,
            equips: nombreEquips,
            pelicules: nombrePeliculesSelect.value,
            temps: timeDurationSelect.value
        }
        document.cookie = nomCookie + '=' + (JSON.stringify(valors)) + `;expires=${expiryDate.toUTCString()};path=/;SameSite=Lax;Secure`;
        if (debug) {
            missatgeConsola(JSON.stringify(valors));
        }
    }

    function recullCookie() { 
        const nameEQ = nomCookie + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) cookieObject = JSON.parse(c.substring(nameEQ.length, c.length));
            //if (c.indexOf(nameEQ) == 0) return JSON.parse(c.substring(nameEQ.length, c.length));
        }

        if (debug) {
            missatgeConsola(cookieObject);
        }
        idiomaActual = cookieObject.idioma;
        nombreEquips = cookieObject.equips;
    }

    function esborraCookie() {
        document.cookie = nomCookie + '=; Max-Age=-99999999;SameSite=Lax;Secure';
    }

    function estableixIdioma(lang) {
        idiomaActual = lang;
        traduirPagina();
        estableixCookie();
    }

    function traduirPagina() {
        document.querySelectorAll('[data-translation-key]').forEach(element => {
            const key = element.getAttribute('data-translation-key');
            if (translations[idiomaActual] && translations[idiomaActual][key]) {
                element.textContent = translations[idiomaActual][key];
            }
        });
        // Set language options
        document.querySelector('option[value="ca"]').textContent = translations[idiomaActual]['catala_i18n'];
        document.querySelector('option[value="es"]').textContent = translations[idiomaActual]['castella_i18n'];
        document.querySelector('option[value="en"]').textContent = translations[idiomaActual]['angles_i18n'];
        document.querySelector('option[value="fr"]').textContent = translations[idiomaActual]['frances_i18n'];    
    }

    function loadMovieTitle(movie) {
        const title = movie[idiomaActual] || movie['ca'];
        document.getElementById('titolPelicula').textContent = title;
    }

    function recullTraduccions() {
        fetch('https://pelismimic.github.io/traduccions.json')
            .then(response => response.json())
            .then(data => {
                translations = data;
                estableixIdioma(idiomaActual || navigator.language.split('-')[0] || 'ca');
            })
            .catch(error => console.error('Error carregant les traduccions:', error));
    }

    function recullPelicules() {
        fetch('https://pelismimic.github.io/pelicules.json')
            .then(response => response.json())
            .then(data => {
                movieList = data;
            })
            .catch(error => console.error('Error carregant les pel·lícules:', error));
    }

    function conmutaConfiguracio(show) {
        if (debug) {
            missatgeConsola(show);
        }
        configuracioModal.classList.toggle('hidden', !show);
        if (show) {
            pantallaJoc.classList.add('blur-background');
        } else {
            pantallaJoc.classList.remove('blur-background');
        }
        botoConfiguracio.classList.toggle('hidden', show);
        botoAjuda.classList.toggle('hidden', show);
    }

    function conmutaAjuda(show) {
        modalAjuda.classList.toggle('hidden', !show);
        botoConfiguracio.classList.toggle('hidden', show);
        botoAjuda.classList.toggle('hidden', show);
    }

    function actualitzaComptadors() {
        for (let i = 1; i <= nombreEquipsMax; i++) {
            document.getElementById(`equip${i}`).classList.toggle('highlight', i === equipActual);
            document.getElementById(`equip${i}`).classList.toggle(`equip${i}`, i === equipActual);
        }
    }

    function canviaTorn() {
        if (debug) {
            missatgeConsola("equipActual: " + equipActual + " | " + "nombreEquips: " + nombreEquips);
        }
        equipActual = (equipActual % nombreEquips) + 1;
        actualitzaComptadors();
        turnMessage.textContent = `Torn de l'equip ${equipActual}`;
        turnMessage.className = `equip${equipActual}`;
    }

    function iniciaPartida() {
        for (let i = 1; i <= nombreEquipsMax; i++) {
            document.getElementById(`equip${i}`).textContent = "0"
            if (i <= nombreEquips) {
                document.getElementById(`equip${i}`).classList.toggle('hidden', false);
                document.getElementById(`equip${i}`).classList.toggle(`equip${i}`, true);
            }
            else {
                document.getElementById(`equip${i}`).classList.toggle('hidden', true);
            }
        }
        equipActual = nombreEquips;
        montarDebugMissatge();
    }

    function començaCompteEnrera(duration) {
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
                //endButton.classList.add('hidden');
                botoRespostaCorrecta.classList.remove('hidden');
                botoRespostaIncorrecta.classList.remove('hidden');
            }
        }, 1000);
    }

    botoConfiguracio.addEventListener('click', () => conmutaConfiguracio(true));
    botoCancelConfig.addEventListener('click', () => conmutaConfiguracio(false));
    botoModifConfig.addEventListener('click', () => {
        nombreEquips = parseInt(nombreEquipsSelect.value);
        const duration = parseInt(timeDurationSelect.value);
        const nombrePelicules = parseInt(nombrePeliculesSelect.value);
        estableixIdioma(selectorIdioma.value);
        conmutaConfiguracio(false);
        iniciaPartida();
    });

    botoAjuda.addEventListener('click', () => conmutaAjuda(true));
    botoTancarAjuda.addEventListener('click', () => conmutaAjuda(false));

    turnMessage.addEventListener('click', () => {
        //turnButton.classList.add('hidden');
        //botoRevelarPelicula.classList.remove('hidden');
        botoComençar.classList.add('hidden');
        //endButton.classList.add('hidden');
    });

    botoRevelarPelicula.addEventListener('click', () => {
        currentMovieIndex = (currentMovieIndex + 1) % movieList.length;
        loadMovieTitle(movieList[currentMovieIndex]);
        titolPelicula.classList.remove('hidden');
        botoRevelarPelicula.classList.add('hidden');
        botoComençar.classList.remove('hidden');
    });

    botoComençar.addEventListener('click', () => {
        const duration = parseInt(timeDurationSelect.value);
        començaCompteEnrera(duration);
        botoComençar.classList.add('hidden');
        //endButton.classList.remove('hidden');
    });

    /*
    endButton.addEventListener('click', () => {
        clearInterval(compteEnreraTimer);
        compteEnrera.classList.add('hidden');
        endButton.classList.add('hidden');
        botoRespostaCorrecta.classList.remove('hidden');
        botoRespostaIncorrecta.classList.remove('hidden');
    });   */

    botoRespostaCorrecta.addEventListener('click', () => {
        const teamScore = document.getElementById(`team${equipActual}`);
        teamScore.textContent = parseInt(teamScore.textContent) + 1;
        respostaCorrecta.classList.add('hidden');
        respostaIncorrecta.classList.add('hidden');
        turnMessage.classList.remove('hidden');
        titolPelicula.classList.add('hidden');
        canviaTorn();
    });

    botoRespostaIncorrecta.addEventListener('click', () => {
        respostaCorrecta.classList.add('hidden');
        respostaIncorrecta.classList.add('hidden');
        turnMessage.classList.remove('hidden');
        titolPelicula.classList.add('hidden');
        canviaTorn();
    });

    recullTraduccions();
    recullPelicules();
    recullCookie();
    iniciaPartida();
});
//pelismimic:"{"idioma":"ca","equips":2}"