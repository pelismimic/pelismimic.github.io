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
    const ESCENAJOC = Object.freeze({
        INICIARPARTIDA: 'INICIARPARTIDA',
        TORNEQUIP: 'TORNEQUIP',
        REVELARPELICULA: 'REVELARPELICULA',
        COMPTANTTEMPS: 'COMPTANTTEMPS',
        ACABATTEMPS: 'ACABATTEMPS',
        ACABADAPARTIDA: 'ACABADAPARTIDA',
        CONFIGURANT: 'CONFIGURANT',
        AJUDANT: 'AJUDANT'
    });
    // debug
    let debugActiu = true;
    // variables
    let conjuntTraduccions = {};
    let llistaPelicules = {};
    let idiomaActual = IDIOMAINICIAL;
    let equipActual = EQUIPACTUALINICIAL;
    let compteEnreraTimer;
    let NOMBREPELICULESMAX = 0;
    let llistaPeliculesUsades = [];

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
        missatgeConsola("[estableixCookie] Ini.");
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
        missatgeConsola("[estableixCookie] Fi." + JSON.stringify(valors));
    }

    function recullCookie() { 
        missatgeConsola("[recullCookie] Ini.");
        const nameEQ = NOMCOOKIE + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) cookieObject = JSON.parse(c.substring(nameEQ.length, c.length));
            //if (c.indexOf(nameEQ) == 0) return JSON.parse(c.substring(nameEQ.length, c.length));
        }
        missatgeConsola("[recullCookie] Fi.", cookieObject);

        selectorIdioma.value = idiomaActual = cookieObject.idioma;
        nombreEquipsSelect.value = cookieObject.equips;
        nombrePeliculesSelect.value = cookieObject.pelicules;
        timeDurationSelect.value = cookieObject.temps;
    }

    function esborraCookie() {
        document.cookie = NOMCOOKIE + '=; Max-Age=-99999999;SameSite=Lax;Secure';
        missatgeConsola("[esborraCookie]");
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
        missatgeConsola("[recullPelicules] Ini.");
        return fetch('https://pelismimic.github.io/pelicules.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la resposta de la xarxa');
            }
            return response.json();
        })
        .then(data => {
            llistaPelicules = data.movies;
            NOMBREPELICULESMAX = llistaPelicules.length;
            missatgeConsola('[recullPelicules] Fi. NOMBREPELICULESMAX:', NOMBREPELICULESMAX);
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
       /* novaPeli = 1;
        // generar aleatori i mirar si no ha sortit a la partida
        llistaPeliculesUsades.push(novaPeli);
        const titol = llistaPelicules[1][idiomaActual];
        document.getElementById('titolPelicula').textContent = titol;
        missatgeConsola(`[TriarNovaPelicula]`);*/


        const peliculesDisponibles = llistaPelicules.filter(pelicula => !llistaPeliculesUsades.includes(pelicula));
        if (peliculesDisponibles.length === 0) {
            appMissatge.textContent = 'Totes les pel·lícules han estat utilitzades!';
            return;
        }
        const indexAleatori = Math.floor(Math.random() * peliculesDisponibles.length);
        const peliculaSeleccionada = peliculesDisponibles[indexAleatori];
        document.getElementById('titolPelicula').textContent =  peliculaSeleccionada[idiomaActual];
        llistaPeliculesUsades.push(peliculaSeleccionada);
        
        missatgeConsola('[TriarNovaPelicula]', ` usades:${llistaPeliculesUsades.length}  queden:${peliculesDisponibles.length}  triada:${indexAleatori}`);
    }

    function conmutaVisualitzarBotons(estat) {
        // Set specific buttons to visible based on the state
        switch (estat) {
            case ESCENAJOC.INICIARPARTIDA:
                botoComençarPartida.classList.remove('hidden');
                botoRevelarPelicula.classList.add('hidden');
                botoComençarComptar.classList.add('hidden');
                botoRespostaCorrecta.classList.add('hidden');
                botoRespostaIncorrecta.classList.add('hidden');
                titolPelicula.classList.add('hidden');
                compteEnrera.classList.add('hidden');
                missatgeConsola('[conmutaVisualitzarBotons]', ESCENAJOC.INICIARPARTIDA); 
                break;
            case ESCENAJOC.TORNEQUIP:
                botoComençarPartida.classList.add('hidden');
                botoRevelarPelicula.classList.remove('hidden');
                botoComençarComptar.classList.add('hidden');
                botoRespostaCorrecta.classList.add('hidden');
                botoRespostaIncorrecta.classList.add('hidden');
                titolPelicula.classList.add('hidden');
                compteEnrera.classList.add('hidden');
                missatgeConsola('[conmutaVisualitzarBotons]', ESCENAJOC.TORNEQUIP); 
                break;
            case ESCENAJOC.REVELARPELICULA: 
                botoComençarPartida.classList.add('hidden');
                botoRevelarPelicula.classList.add('hidden');
                botoComençarComptar.classList.remove('hidden');
                botoRespostaCorrecta.classList.add('hidden');
                botoRespostaIncorrecta.classList.add('hidden');
                titolPelicula.classList.remove('hidden');
                compteEnrera.classList.add('hidden');
                missatgeConsola('[conmutaVisualitzarBotons]', ESCENAJOC.REVELARPELICULA); 
                break;            
            case ESCENAJOC.COMPTANTTEMPS:
                botoComençarPartida.classList.add('hidden');
                botoRevelarPelicula.classList.add('hidden');
                botoComençarComptar.classList.add('hidden');
                botoRespostaCorrecta.classList.remove('hidden');
                botoRespostaIncorrecta.classList.add('hidden');
                titolPelicula.classList.add('equip1');
                compteEnrera.classList.remove('hidden');
                missatgeConsola('[conmutaVisualitzarBotons]', ESCENAJOC.COMPTANTTEMPS); 
                break;
            case ESCENAJOC.ACABATTEMPS: 
                botoComençarPartida.classList.add('hidden');
                botoRevelarPelicula.classList.add('hidden');
                botoComençarComptar.classList.add('hidden');
                botoRespostaCorrecta.classList.remove('hidden');
                botoRespostaIncorrecta.classList.remove('hidden');
                titolPelicula.classList.remove('hidden');
                compteEnrera.classList.remove('hidden');
                missatgeConsola('[conmutaVisualitzarBotons]', ESCENAJOC.ACABATTEMPS); 
                break;
            case ESCENAJOC.ACABADAPARTIDA: 
                botoComençarPartida.classList.add('hidden');
                botoRevelarPelicula.classList.add('hidden');
                botoComençarComptar.classList.add('hidden');
                botoRespostaCorrecta.classList.remove('hidden');
                botoRespostaIncorrecta.classList.remove('hidden');
                titolPelicula.classList.add('hidden');
                compteEnrera.classList.add('hidden');
                missatgeConsola('[conmutaVisualitzarBotons]', ESCENAJOC.ACABADAPARTIDA); 
                break;
        }
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
        for (let i = 1; i <= NOMBREEQUIPSMAX; i++) {
            appMissatge.classList.remove(`equip${i}`);
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
        conmutaVisualitzarBotons(ESCENAJOC.INICIARPARTIDA);
        missatgeConsola(`[prepararPartida]  ${appMissatge.textContent}`);

    }

    function iniciaPartida() {      
        appMissatge.textContent = `Torn de l'equip ${equipActual}`;
        appMissatge.classList.add(`equip${equipActual}`); 
        conmutaVisualitzarBotons(ESCENAJOC.TORNEQUIP);
        missatgeConsola("[iniciaPartida]    equipActual: " + equipActual); 
    }

    function formatejaCompteEnrera(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function començaCompteEnrera() {
        let time = timeDurationSelect.value;
        compteEnrera.textContent = formatejaCompteEnrera(time);
        conmutaVisualitzarBotons(ESCENAJOC.COMPTANTTEMPS);
        compteEnreraTimer = setInterval(() => {
            time -= 1;
            compteEnrera.textContent = formatejaCompteEnrera(time);
            if (time <= 0) {
                new Audio('https://pelismimic.github.io/sirena.mp3').play();
                acabatCompteEnrera();
            }
        }, 1000);
    }

    function acabatCompteEnrera() {
        aturaCompteEnrera()
        appMissatge.textContent = `Equip ${equipActual} :  S'ha acabat el temps!`;
        conmutaVisualitzarBotons(ESCENAJOC.ACABATTEMPS);    
    }

    function aturaCompteEnrera() {
        clearInterval(compteEnreraTimer);
    }

    botoRespostaCorrecta.addEventListener('click', () => {
        aturaCompteEnrera()
        const puntsEquip = document.getElementById(`equip${equipActual}`);
        puntsEquip.textContent = parseInt(puntsEquip.textContent) + 1;
        canviaTorn();        
        conmutaVisualitzarBotons(ESCENAJOC.TORNEQUIP);    
    });

    botoRespostaIncorrecta.addEventListener('click', () => {    
        conmutaVisualitzarBotons(ESCENAJOC.TORNEQUIP); 
        canviaTorn();
    });

    botoRevelarPelicula.addEventListener('click', () => {
        //currentMovieIndex = (currentMovieIndex + 1) % movieList.length;
        currentMovieIndex = 1;
        TriarNovaPelicula()
        conmutaVisualitzarBotons(ESCENAJOC.REVELARPELICULA); 
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

    missatgeConsola("[INICI 000]");
    recullPelicules();
    recullTraduccions();
    recullCookie();
    prepararPartida();
});