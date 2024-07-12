document.addEventListener('DOMContentLoaded', () => {

    
    // DOM elements
    const pantallaJoc = document.getElementById('pantallaJoc');
    //
    const appMissatge = document.getElementById('appMissatge');
    const botoRevelarPelicula = document.getElementById('botoRevelarPelicula');
    const botoComençar = document.getElementById('botoComençar');
    //const endButton = document.getElementById('endButton');
    const botoRespostaCorrecta = document.getElementById('botoRespostaCorrecta');
    const botoRespostaIncorrecta = document.getElementById('botoRespostaIncorrecta');
    const compteEnrera = document.getElementById('compteEnrera');
    const titolPelicula = document.getElementById('titolPelicula');
    //
    const selectorIdioma = document.getElementById('selectorIdioma');
    const nombreEquipsSelect = document.getElementById('nombreEquips');
    const timeDurationSelect = document.getElementById('timeDuration');
    const nombrePeliculesSelect = document.getElementById('nombrePelicules');
    //const config = document.getElementById('config'); 
    const botoModifConfig = document.getElementById('botoModifConfig');
    const botoCancelConfig = document.getElementById('botoCancelConfig');
    //
    const ajudaModal = document.getElementById('ajudaModal');
    const ajudaText = document.getElementById('ajudaText'); // cal?
    const botoTancarAjuda = document.getElementById('botoTancarAjuda');
    //
    const botoConfiguracio = document.getElementById('botoConfiguracio');
    const botoAjuda = document.getElementById('botoAjuda');
    //
    const debugMissatge = document.getElementById('debugMissatge');

    // "constants"
    let NOMBREEQUIPSMAX = 6;
    let EQUIPACTUALINICIAL = 1;
    let NOMBREEQUIPSINICIAL = 2;
    let IDIOMAINICIAL = 'ca';
    let NOMBREPELICULESINICIAL = 4;
    let TEMPSINICIAL = 60;
    let NOMCOOKIE = 'pelismimic';
    // debug
    let debugActiu = true;
    // variables
    let conjuntTraduccions = {};
    let moviesList = {};
    let idiomaActual = IDIOMAINICIAL;
    let equipActual = EQUIPACTUALINICIAL;
    let compteEnreraTimer;
    let NOMBREPELICULESMAX = 0;
    let llistaPeliculesAdivinades = [];

    nombreEquipsSelect.value = NOMBREEQUIPSINICIAL;
    timeDurationSelect.value = TEMPSINICIAL;
    nombrePeliculesSelect.value = NOMBREPELICULESINICIAL; 
    selectorIdioma.value = IDIOMAINICIAL;

    function montarDebugMissatge() {
        const dataihora = new Date();
        debugMissatge.textContent = dataihora.toUTCString() + " | equips:" + nombreEquipsSelect.value + " | temps:" + timeDurationSelect.value + 
        " | pelis:" + nombrePeliculesSelect.value + " | idioma:" + selectorIdioma.value + " | equipActual:" + equipActual;
        missatgeConsola(debugMissatge.textContent);
    }

    function missatgeConsola(text1, text2) {
        if (debugActiu) {
            const dataihora = new Date();
            console.log(dataihora.getUTCHours() + ':' + dataihora.getUTCMinutes() + ':' + dataihora.getUTCSeconds() + '.' + dataihora.getUTCMilliseconds(), text1, text2);
        }
    }

    function estableixCookie() {
        esborraCookie(); 
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        const valors = {
            idioma: idiomaActual,
            equips: nombreEquipsSelect.value,
            pelicules: nombrePeliculesSelect.value,
            temps: timeDurationSelect.value
        }
        document.cookie = NOMCOOKIE + '=' + (JSON.stringify(valors)) + `;expires=${expiryDate.toUTCString()};path=/;SameSite=Lax;Secure`;
        missatgeConsola("[estableixCookie]" + JSON.stringify(valors));
    }

    function recullCookie() { 
        const nameEQ = NOMCOOKIE + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) cookieObject = JSON.parse(c.substring(nameEQ.length, c.length));
            //if (c.indexOf(nameEQ) == 0) return JSON.parse(c.substring(nameEQ.length, c.length));
        }
        missatgeConsola("[recullCookie]", cookieObject);

        selectorIdioma.value = idiomaActual = cookieObject.idioma;
        nombreEquipsSelect.value = cookieObject.equips;
        nombrePeliculesSelect.value = cookieObject.pelicules;
        timeDurationSelect.value = cookieObject.temps;
    }

    function esborraCookie() {
        document.cookie = NOMCOOKIE + '=; Max-Age=-99999999;SameSite=Lax;Secure';
    }

    function estableixIdioma(lang) {
        idiomaActual = lang;
        traduirPagina();
        estableixCookie();
    }

    function traduirPagina() {
        document.querySelectorAll('[data-translation-key]').forEach(element => {
            const key = element.getAttribute('data-translation-key');
            if (conjuntTraduccions[idiomaActual] && conjuntTraduccions[idiomaActual][key]) {
                element.textContent = conjuntTraduccions[idiomaActual][key];
            }
        });
        // Set language options
        document.querySelector('option[value="ca"]').textContent = conjuntTraduccions[idiomaActual]['catala_i18n'];
        document.querySelector('option[value="es"]').textContent = conjuntTraduccions[idiomaActual]['castella_i18n'];
        document.querySelector('option[value="en"]').textContent = conjuntTraduccions[idiomaActual]['angles_i18n'];
        document.querySelector('option[value="fr"]').textContent = conjuntTraduccions[idiomaActual]['frances_i18n'];    
    }

    function recullTraduccions() {
        fetch('https://pelismimic.github.io/traduccions.json')
            .then(response => response.json())
            .then(data => {
                conjuntTraduccions = data;
                estableixIdioma(idiomaActual || navigator.language.split('-')[0] || 'ca');
            })
            .catch(error => console.error('Error carregant les traduccions:', error));
    }

    function recullPelicules() {
        fetch('https://pelismimic.github.io/pelicules.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la resposta de la xarxa');
            }
            return response.json();
        })
        .then(data => {
            moviesList = data.movies;
            NOMBREPELICULESMAX = moviesList.length;
            missatgeConsola('[recullPelicules] NOMBREPELICULESMAX:', NOMBREPELICULESMAX);
        })
        .catch(error => console.error('Error carregant les pel·lícules:', error));
    }

    function conmutaConfiguracio(show) {
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
        ajudaModal.classList.toggle('hidden', !show);
        if (show) {
            pantallaJoc.classList.add('blur-background');
        } else {
            pantallaJoc.classList.remove('blur-background');
        }
        botoConfiguracio.classList.toggle('hidden', show);
        botoAjuda.classList.toggle('hidden', show);
    }

    function TriarNovaPelicula() {
        novaPeli = 1;
        // generar aleatori i mirar si no ha sortit a la partida

        llistaPeliculesAdivinades.push(novaPeli);
        const titol = moviesList[1][idiomaActual];
        document.getElementById('titolPelicula').textContent = titol;
        missatgeConsola(`[TriarNovaPelicula]`);
    }

    function actualitzaComptadors() {
        for (let i = 1; i <= nombreEquipsSelect.value; i++) {
            document.getElementById(`equip${i}`).classList.toggle('jugant', i === equipActual);
        }
        missatgeConsola(`[actualitzaComptadors]`);
    }

    function canviaTorn() {
        appMissatge.classList.remove(`equip${equipActual}`);
        equipActual = (equipActual % nombreEquipsSelect.value) + 1;
        actualitzaComptadors();
        appMissatge.textContent = `Torn de l'equip ${equipActual}`;
        appMissatge.classList.add(`equip${equipActual}`);
        botoRevelarPelicula.classList.remove('hidden');
        montarDebugMissatge();
        missatgeConsola(`[canviaTorn] torn ${equipActual}`); 
    }

    function prepararPartida() {
        equipActual = 1;
        appMissatge.textContent = `${nombrePeliculesSelect.value} pelicules. Temps ${formatejaCompteEnrera(timeDurationSelect.value)}`;
        appMissatge.classList.remove('hidden');
        botoComençarPartida.classList.remove('hidden');        
        botoRevelarPelicula.classList.add('hidden');
        for (let i = 1; i <= NOMBREEQUIPSMAX; i++) {
            document.getElementById(`equip${i}`).textContent = "0"
            if (i <= nombreEquipsSelect.value) {
                document.getElementById(`equip${i}`).classList.toggle('hidden', false);
                document.getElementById(`equip${i}`).classList.toggle(`equip${i}`, true);
                document.getElementById(`equip${i}`).classList.toggle('jugant', i === equipActual);
            }
            else {
                document.getElementById(`equip${i}`).classList.toggle('hidden', true);
            }
        }
        missatgeConsola(`[prepararPartida]  ${appMissatge.textContent}`); 
    }

    function iniciaPartida() {      
        appMissatge.textContent = `Torn de l'equip ${equipActual}`;
        appMissatge.classList.add(`equip${equipActual}`);
        //document.getElementById(`equip${equipActual}`).classList.add('jugant');
        botoComençarPartida.classList.add('hidden');
        botoRevelarPelicula.classList.remove('hidden');
        botoRespostaCorrecta.classList.add('hidden');
        botoRespostaIncorrecta.classList.add('hidden');
        missatgeConsola("[iniciaPartida]    equipActual: " + equipActual);
        montarDebugMissatge();
    }

    function formatejaCompteEnrera(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function començaCompteEnrera() {
        let time = timeDurationSelect.value;
        compteEnrera.textContent = formatejaCompteEnrera(time);
        compteEnrera.classList.remove('hidden');

        compteEnreraTimer = setInterval(() => {
            time -= 1;
            compteEnrera.textContent = formatejaCompteEnrera(time);
            if (time <= 0) {
                new Audio('https://pelismimic.github.io/sirena.mp3').play();
                aturaCompteEnrera();
            }
        }, 1000);
    }

    function aturaCompteEnrera() {
        clearInterval(compteEnreraTimer);
        compteEnrera.textContent = "0:00";
        appMissatge.textContent = `Equip ${equipActual} :  S'ha acabat el temps!`;
        botoRespostaCorrecta.classList.remove('hidden');
        botoRespostaIncorrecta.classList.remove('hidden');    
    }

    botoRespostaCorrecta.addEventListener('click', () => {
        const puntsEquip = document.getElementById(`equip${equipActual}`);
        puntsEquip.textContent = parseInt(puntsEquip.textContent) + 1;
        botoRespostaCorrecta.classList.add('hidden');
        botoRespostaIncorrecta.classList.add('hidden');
        appMissatge.classList.remove('hidden');
        titolPelicula.classList.add('hidden');
        canviaTorn();
    });

    botoRespostaIncorrecta.addEventListener('click', () => {
        botoRespostaCorrecta.classList.add('hidden');
        botoRespostaIncorrecta.classList.add('hidden');
        appMissatge.classList.remove('hidden');
        titolPelicula.classList.add('hidden');
        canviaTorn();
    });

    botoRevelarPelicula.addEventListener('click', () => {
        //currentMovieIndex = (currentMovieIndex + 1) % movieList.length;
        currentMovieIndex = 1;
        TriarNovaPelicula()
        titolPelicula.classList.remove('hidden');
        botoRevelarPelicula.classList.add('hidden');
        botoComençar.classList.remove('hidden');
    });

    botoComençarPartida.addEventListener('click', () => {
        missatgeConsola("->[iniciarPartida]");
        iniciaPartida();
    });

    botoComençarComptar.addEventListener('click', () => {
        començaCompteEnrera();
    });

    // configuració
    botoConfiguracio.addEventListener('click', () => conmutaConfiguracio(true));
    botoCancelConfig.addEventListener('click', () => conmutaConfiguracio(false));
    botoModifConfig.addEventListener('click', () => {
        estableixIdioma(selectorIdioma.value);
        conmutaConfiguracio(false);
        prepararPartida();
    });

    // ajuda
    botoAjuda.addEventListener('click', () => conmutaAjuda(true));
    botoTancarAjuda.addEventListener('click', () => conmutaAjuda(false));

    missatgeConsola("[DOMContentLoaded]");
    
    missatgeConsola("->[recullTraduccions]");
    recullTraduccions();
    missatgeConsola("->[recullPelicules]");
    recullPelicules();
    missatgeConsola("->[recullCookie]");
    recullCookie();
    missatgeConsola("->[prepararPartida]");
    prepararPartida();
    //iniciaPartida();
});
//pelismimic:"{"idioma":"ca","equips":2}"