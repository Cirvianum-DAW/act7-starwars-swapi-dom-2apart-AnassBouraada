import swapi from './swapi.js';

//Exemple d'inicialització de la llista de pel·lícules. Falten dades!
async function setMovieHeading(movieId, titleSelector, infoSelector, directorSelector) {
  // Obtenim els elements del DOM amb QuerySelector
  const title = document.querySelector(titleSelector);
  const info = document.querySelector(infoSelector)
  const director = document.querySelector(directorSelector)

  if (!movieId) {
    title.innerHTML = ''
    info.innerHTML = ''
    director.innerHTML = ''
    return
  }
  // Obtenim la informació de la pelicula
  const movieInfo = await swapi.getMovieInfo(movieId);
  // Injectem
  title.innerHTML = movieInfo.name
  info.innerHTML = `Episode ${movieInfo.episodeID} - ${movieInfo.release}`
  director.innerHTML = `Director: ${movieInfo.director}`
}

async function initMovieSelect(selector) {

  const pelicules = await swapi.listMoviesSorted();

  const select = document.querySelector(selector);

  const option = document.createElement('option');
  option.value = '';
  option.textContent = 'Selecciona una pelicula';
  select.appendChild(option);

  pelicules.forEach(pelicula => {
    const option = document.createElement('option');
    option.value = _filmIdToEpisodeId(pelicula.episodeID)
    option.textContent = pelicula.name;
    select.appendChild(option);
  });

}

function deleteAllCharacterTokens() { }

// EVENT HANDLERS //

function addChangeEventToSelectHomeworld() {

  document.querySelector('.list__characters').innerHTML = '';

  const planeta = document.querySelector('#select-homeworld');

  planeta.addEventListener('change', _handleOnSelectPlanetChanged);
}

async function _handleOnSelectPlanetChanged(event) {

  const idPelicula = document.querySelector('#select-movie').value;

  let caracters = (await swapi.getMovieCharactersAndHomeworlds(idPelicula)).characters;


  caracters.forEach(caracter => {
    if (caracter.homeworld == event.target.value) {
      _createCharacterTokens(caracter);
    }
  })

}

async function _createCharacterTokens(caracter) {
  // Crear el <li> principal
  const ficha = document.createElement('li');
  ficha.classList.add('list__item', 'item', 'character');

  // Crear i afegir la imatge
  const img = document.createElement('img');
  const parts = caracter.url.split('/');
  const planetId = parts.pop(); // Extreu l'últim element (l'identificador de la planeta)
  img.src = "/../public/assets/people/" + planetId +".jpg";
  img.classList.add('character__image');
  img.style.maxWidth = '100%'
  ficha.appendChild(img);

  // Crear i afegir el títol (nom del personatge)
  const h2 = document.createElement('h2');
  h2.innerHTML = caracter.name;
  h2.classList.add('character__name');
  ficha.appendChild(h2);

  // Crear i afegir la informació de data de naixement
  const birthDiv = document.createElement('div');
  birthDiv.classList.add('character__birth');
  const birthStrong = document.createElement('strong');
  birthStrong.innerHTML = `<strong>Birth Year:</strong> ${caracter.birth_year}`;
  birthDiv.appendChild(birthStrong);
  ficha.appendChild(birthDiv);

  // Crear i afegir la informació de color d'ulls
  const eyeDiv = document.createElement('div');
  eyeDiv.classList.add('character__eye');
  const eyeStrong = document.createElement('strong');
  eyeStrong.innerHTML = `<strong>Eye color:</strong> ${caracter.eye_color}`;
  eyeDiv.appendChild(eyeStrong);
  ficha.appendChild(eyeDiv);

  // Crear i afegir la informació de gènere
  const genderDiv = document.createElement('div');
  genderDiv.classList.add('character__gender');
  const genderStrong = document.createElement('strong');
  genderStrong.innerHTML = `<strong>Gender:</strong> ${caracter.gender}`;
  genderDiv.appendChild(genderStrong);
  ficha.appendChild(genderDiv);

  // Crear i afegir la informació del planeta d'origen
  const homeWorldDiv = document.createElement('div');
  homeWorldDiv.classList.add('character__home');
  const homeWorldStrong = document.createElement('strong');
  homeWorldStrong.innerHTML = `<strong>Home World:</strong> ${caracter.homeworld}`;
  homeWorldDiv.appendChild(homeWorldStrong);
  ficha.appendChild(homeWorldDiv);

  // Afegir la fitxa del personatge a la llista de personatges
  document.querySelector(".list__characters").appendChild(ficha);
}


function _addDivChild(parent, className, html) {

}

function setMovieSelectCallbacks() {
  const select = document.querySelector('#select-movie');
  select.addEventListener('change', _handleOnSelectMovieChanged);
}



async function _handleOnSelectMovieChanged(event) {
  setMovieHeading(event.target.value, '.movie__title', '.movie__info', '.movie__director');
  const selector = document.querySelector('#select-homeworld');
  selector.innerHTML = '';

  const option = document.createElement('option');
  option.value = '';
  option.textContent = 'Selecciona un homeworld';
  selector.appendChild(option);

  const caracters = await swapi.getMovieCharactersAndHomeworlds(event.target.value);

  const planetas = caracters.characters.map((caracter) => {
    return caracter.homeworld;
  })

  const planetasNoDuplicats = new Set(planetas);

  let result = [...planetasNoDuplicats].sort(); //Aqui el que fem es convertir el Set en un array i ordenar-lo alfabeticament amb sort() i els [...] que es un spread operator que 

  result.forEach(planeta => {
    const option = document.createElement('option');
    option.value = planeta;
    option.textContent = planeta;
    selector.appendChild(option);
  });

  document.querySelector('.list__characters').innerHTML = '';
}

function _filmIdToEpisodeId(episodeID) {
  const mapping = episodeToMovieIDs.find(item => item.e === episodeID)
  if (mapping) {
    return mapping.m
  } else {
    return null
  }
}

// "https://swapi.dev/api/films/1/" --> Episode_id = 4 (A New Hope)
// "https://swapi.dev/api/films/2/" --> Episode_id = 5 (The Empire Strikes Back)
// "https://swapi.dev/api/films/3/" --> Episode_id = 6 (Return of the Jedi)
// "https://swapi.dev/api/films/4/" --> Episode_id = 1 (The Phantom Menace)
// "https://swapi.dev/api/films/5/" --> Episode_id = 2 (Attack of the Clones)
// "https://swapi.dev/api/films/6/" --> Episode_id = 3 (Revenge of the Sith)

let episodeToMovieIDs = [
  { m: 1, e: 4 },
  { m: 2, e: 5 },
  { m: 3, e: 6 },
  { m: 4, e: 1 },
  { m: 5, e: 2 },
  { m: 6, e: 3 },
];

function _setMovieHeading({ name, episodeID, release, director }) { }

function _populateHomeWorldSelector(homeworlds) { }

/**
 * Funció auxiliar que podem reutilitzar: eliminar duplicats i ordenar alfabèticament un array.
 */
function _removeDuplicatesAndSort(elements) {
  // Al crear un Set eliminem els duplicats
  const set = new Set(elements);
  // tornem a convertir el Set en un array
  const array = Array.from(set);
  // i ordenem alfabèticament
  return array.sort(swapi._compareByName);
}

const act7 = {
  setMovieHeading,
  setMovieSelectCallbacks,
  initMovieSelect,
  deleteAllCharacterTokens,
  addChangeEventToSelectHomeworld,
};

export default act7;