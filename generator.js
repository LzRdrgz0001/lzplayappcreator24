let isSerie = document.getElementById('serie');
let isMovie = document.getElementById('movie');

let types = document.querySelectorAll('input[type=radio][name=type]');

types.forEach(type => {
    type.addEventListener('change', () =>{
        if (type.value == "movie") {
            document.getElementById('season-selector').style.display = "none";
        } else if (type.value == "serie"){
            document.getElementById('season-selector').style.display = "block";
        }
    })
})


function convertMinutes(minutess){
    let hours = Math.floor(minutess / 60) ,
    minutes = Math.floor(minutess % 60),
    total = '';

    if (minutess < 60){
        total = `${minutes}m`
        return total
    } else if (minutess > 60){
      total = `${hours}h ${minutes}m`
      return total
    } else if (minutess = 60){
        total = `${hours}h`
        return total
    }
}


function generar() {
    let serieKey = document.getElementById('numero').value;
    let languaje = "es-MX"
    let seasonNumber = document.getElementById('numeroTemporada').value;

    const cargarPeliculas = async() => {

        if (isSerie.checked) {
            try {

                const respuesta = await fetch(`https://api.themoviedb.org/3/tv/${serieKey}?api_key=1d79b0abc34e3411aed8ee793526693d&language=${languaje}`);
                const respuesta3 = await fetch(`https://api.themoviedb.org/3/tv/${serieKey}/season/${seasonNumber}?api_key=1d79b0abc34e3411aed8ee793526693d&language=${languaje}`);
    
                if (respuesta.status === 200) {
                    const datos = await respuesta.json();
                    const datosTemporada = await respuesta3.json();
                    console.log(datos)
                    let tags = '';
    
                    datos.genres.forEach((genre, index) => {
                        if (index > 2) {
                            return
                        }
                        tags += `${genre.name},`          

                    });

                       
                    let episodeList = '';
    
                    datosTemporada.episodes.forEach(episode => {
                        let runtime ;
                        if (episode.runtime != null) {
                            runtime = convertMinutes(episode.runtime);
                        } else {
                            runtime = ''
                        }
                        episodeList += `
<li class="episode-item" data-video-url="__URL__" data-season="season${seasonNumber}" >
        <img src="https://image.tmdb.org/t/p/w300${episode.still_path}" alt="Thumbnail">
        <div class="episode-info">
          <h3>Episode ${episode.episode_number}</h3>
          <p>T${seasonNumber} - EP${episode.episode_number}</p>
        </div>
        <div class="toggle">
          <label>NO VISTO</label>
          <input data-episode="${episode.episode_number}" type="checkbox" />
        </div>
      </li>
                        `
                    })
    
                    let seasonsOption = '';
    
                    datos.seasons.forEach(season => {
                        
                        if(season.name != "Especiales"){
                            seasonsOption += `<option value="${season.season_number}">Temporada ${season.season_number}</option>
                            `
                        }
                    })
    
                    let genSeasonsCount;
    
                    if (datos.number_of_seasons == 1){
                        genSeasonsCount = " Temporada"
                    } else if (datos.number_of_seasons > 1){
                        genSeasonsCount = " Temporadas"
                    }
                    
                    let template = document.getElementById('html-final');
    
                    let justHtml = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Series Episodes</title>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet" />
<style>
body {
background-color: #121212;
color: #ffffff;
font-family: Arial, sans-serif;
margin: 0;
padding: 0;
}
.container {
padding: 20px;
padding-bottom: 80px;
}
.video-container {
position: fixed;
top: 0;
left: 0;
width: 100%;
padding-top: 56.25%;
background-color: #121212;
z-index: 1000;
}
.video-container iframe {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
border: none;
}
.content {
margin-top: 56.25%;
}
.dropdowns {
display: flex;
justify-content: space-between;
margin-bottom: 20px;
}
.dropdowns select {
background-color: #333;
color: #fff;
border: none;
padding: 10px;
font-size: 16px;
border-radius: 5px;
}
.episode-list {
list-style: none;
padding: 0;
max-height: 400px;
overflow-y: auto;
}
.episode-item {
display: flex;
align-items: center;
justify-content: space-between;
background-color: #1e1e1e;
padding: 10px;
margin-bottom: 10px;
border-radius: 5px;
cursor: pointer;
}
.episode-item img {
width: 80px;
height: 45px;
border-radius: 5px;
margin-right: 10px;
}
.episode-info {
flex-grow: 1;
}
.episode-info h3 {
margin: 0;
font-size: 18px;
}
.episode-info p {
margin: 5px 0 0;
color: #888;
}
.toggle {
display: flex;
align-items: center;
}
.toggle label {
margin-right: 10px;
}
.toggle input[type="checkbox"] {
width: 40px;
height: 20px;
appearance: none;
background-color: #555;
border-radius: 10px;
position: relative;
outline: none;
cursor: pointer;
}
.toggle input[type="checkbox"]:checked {
background-color: #0f0;
}
.toggle input[type="checkbox"]::before {
content: '';
position: absolute;
width: 18px;
height: 18px;
background-color: #fff;
border-radius: 50%;
top: 1px;
left: 1px;
transition: 0.3s;
}
.toggle input[type="checkbox"]:checked::before {
transform: translateX(20px);
}
.bottom-nav {
position: fixed;
bottom: 0;
width: 100%;
background-color: #312e2e;
display: flex;
justify-content: space-around;
padding: 15px 0;
}
.bottom-nav a {
color: #888;
text-align: center;
text-decoration: none;
flex-grow: 1;
}
.bottom-nav a.active {
color:rgb(136, 5, 5);
}
.bottom-nav a i {
font-size: 24px;
}
.bottom-nav a span {
display: block;
font-size: 12px;
margin-top: 4px;
}

.synopsis {
display: none;
background-color: #222;
border-radius: 8px;
padding: 10px;
margin-bottom: 20px;
font-size: 15px;
line-height: 1.6;
}

.synopsis-button {
background-color: #333;
color: #fff;
border: none;
border-radius: 8px;
padding: 10px 15px;
cursor: pointer;
font-size: 15px;
margin-left: 10px;
white-space: nowrap;
}
</style>
</head>
<body>

<!-- Video principal -->
<div class="video-container">
<iframe allowfullscreen id="main-video" src="__URL_PRINCIPAL__"></iframe>
</div>

<br>
<div class="container">
<div class="content">
<div class="dropdowns">
<select id="season-select">
<option value="season1">Temporada 1</option>


</select>
<button class="synopsis-button" onclick="toggleSynopsis()">Ver sinopsis</button>
</div>
<div class="synopsis" id="synopsis">
<p>${datos.overview}</p>
</div>
<h2>${datos.name}</h2>

<div id="last-watched-info" style="color: #ccc; margin-bottom: 10px;"></div>
<div id="progress-info" style="color: #999; font-size: 14px; margin-bottom: 20px;"></div>
<button id="reset-progress" style="
  background-color: #660000;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
">
  Reiniciar progreso
</button>




<ul class="episode-list" id="episode-list">
${episodeList}
  <!--PEGAR TEMPORADA ABAJO-->



  <!--NO PASARSE ESTA ETIQUETA-->
</ul>
</div>
</div>

<!-- Navegación inferior -->
<div class="bottom-nav">
<a class="active" href="go:home">
<i class="fa fa-arrow-left"></i>
<span>Regresar</span>
</a>
<a href="go:Buscar">
<i class="fas fa-search"></i>
<span>Buscar</span>
</a>
</div>

const serieId = "${datos.name}"; // <--- cambia este ID en cada HTML de serie

<script>
const serieId = "${datos.name}"; // Cambia esto por el ID único de la serie

document.addEventListener('DOMContentLoaded', function () {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const episodeItems = document.querySelectorAll('.episode-item');
  const mainVideo = document.getElementById('main-video');
  const seasonSelect = document.getElementById('season-select');
  const episodeList = document.getElementById('episode-list');
  const lastWatchedInfo = document.getElementById('last-watched-info');
  const progressInfo = document.getElementById('progress-info');

  // Mostrar estado de episodios
  checkboxes.forEach(function (checkbox) {
    const episode = checkbox.getAttribute('data-episode');
    const label = checkbox.previousElementSibling;
    const key = serieId + "-episode-" + episode;
    const storedStatus = localStorage.getItem(key) === 'true';

    checkbox.checked = storedStatus;
    label.textContent = storedStatus ? 'VISTO' : 'NO VISTO';

    checkbox.addEventListener('change', function () {
      const newStatus = checkbox.checked;
      localStorage.setItem(key, newStatus);
      label.textContent = newStatus ? 'VISTO' : 'NO VISTO';
      updateProgress();
    });

    checkbox.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  });

  // Reproducir episodio y guardar último visto
  episodeItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const videoUrl = item.getAttribute('data-video-url');
      const season = item.getAttribute('data-season');
      const episode = item.querySelector('input[type="checkbox"]').getAttribute('data-episode');

      mainVideo.src = videoUrl;

      localStorage.setItem(serieId + "-last-watched", videoUrl);
      localStorage.setItem(serieId + "-last-watched-season", season);
      localStorage.setItem(serieId + "-last-watched-ep", episode);

      updateLastWatched();
    });
  });

  // Filtro de temporadas
  seasonSelect.addEventListener('change', function () {
    const selectedSeason = seasonSelect.value;
    const episodes = episodeList.querySelectorAll('.episode-item[data-season="' + selectedSeason + '"]');

    episodes.forEach(function (episode) {
      episode.style.display = episode.getAttribute('data-season') === selectedSeason ? 'flex' : 'none';
    });

    updateProgress();
  });

  // Cargar último episodio automáticamente
  const lastVideo = localStorage.getItem(serieId + "-last-watched");
  if (lastVideo) {
    mainVideo.src = lastVideo;
  }

  function updateLastWatched() {
    const ep = localStorage.getItem(serieId + "-last-watched-ep");
    const season = localStorage.getItem(serieId + "-last-watched-season");
    if (ep && season) {
      lastWatchedInfo.textContent = "Último episodio visto: " + season.toUpperCase() + " - EP" + ep;
    } else {
      lastWatchedInfo.textContent = '';
    }
  }

  function updateProgress() {
    const selectedSeason = seasonSelect.value;
    const episodes = episodeList.querySelectorAll('.episode-item[data-season="' + selectedSeason + '"]');

    let total = 0;
    let vistos = 0;

    episodes.forEach(function (ep) {
      const checkbox = ep.querySelector('input[type="checkbox"]');
      total++;
      if (checkbox.checked) {
        vistos++;
      }
    });

    progressInfo.textContent = "Progreso: " + vistos + " de " + total + " episodios vistos";
  }

  // Reiniciar progreso
  document.getElementById('reset-progress').addEventListener('click', function () {
    if (confirm('¿Estás seguro de que deseas reiniciar todo el progreso?')) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(function (checkbox) {
        const episode = checkbox.getAttribute('data-episode');
        const key = serieId + "-episode-" + episode;
        localStorage.removeItem(key);
        checkbox.checked = false;
        checkbox.previousElementSibling.textContent = 'NO VISTO';
      });

      localStorage.removeItem(serieId + "-last-watched");
      localStorage.removeItem(serieId + "-last-watched-ep");
      localStorage.removeItem(serieId + "-last-watched-season");

      document.getElementById('main-video').src = '';
      lastWatchedInfo.textContent = '';
      progressInfo.textContent = 'Progreso: 0 episodios vistos';
    }
  });

  // Inicializar
  seasonSelect.dispatchEvent(new Event('change'));
  updateLastWatched();
});

// Función para mostrar/ocultar la sinopsis
function toggleSynopsis() {
  const synopsis = document.getElementById('synopsis');
  const button = document.querySelector('.synopsis-button');
  if (synopsis.style.display === 'none' || synopsis.style.display === '') {
    synopsis.style.display = 'block';
    button.innerText = 'Ocultar sinopsis';
  } else {
    synopsis.style.display = 'none';
    button.innerText = 'Ver sinopsis';
  }
}
</script>



</body>
</html>



${datos.name} (${datos.first_air_date.slice(0,4)}) lz
                    `;
                    
                    let seasonOnly = `
                    <ul class="caps-grid hide" id="season-${seasonNumber}">
                    ${episodeList}
                    </ul><!--Siguiente temporada debajo-->
    
    
    
                    `;
    
                    const btnCopiar = document.getElementById('copiar');
    
                    if (seasonNumber == 1) {
                        template.innerText = justHtml;
                    } else if (seasonNumber > 1){
                        template.innerText = seasonOnly;
                    }
    
                    let templateHTML = template.innerText;
                    btnCopiar.addEventListener('click', () => {
                        navigator.clipboard.writeText(templateHTML);
                    })

                    
                    let genPoster = document.getElementById('info-poster');
                    let genTitle = document.getElementById('info-title');
                    let genSeasons = document.getElementById('info-seasons');
                    let genYear = document.getElementById('info-year');
    
                    genPoster.setAttribute('src', `https://image.tmdb.org/t/p/w300/${datos.poster_path}`)
                    genTitle.innerText = datos.name;
                    genSeasons.innerText = datos.number_of_seasons + genSeasonsCount;
                    genYear.innerText = datos.first_air_date.slice(0,4);
    
    
    
                } else if (respuesta.status === 401) {
                    console.log('Wrong key');
                } else if (respuesta.status === 404) {
                    console.log('No existe');
                }
    
            } catch (error) {
                console.log(error);
            }
        } else
        if(isMovie.checked){
            try {

            const respuesta = await fetch(`https://api.themoviedb.org/3/movie/${serieKey}?api_key=1d79b0abc34e3411aed8ee793526693d&language=${languaje}`);

            if (respuesta.status === 200) {
                const datos = await respuesta.json();
                let tags = '';
                console.log(datos)


                datos.genres.forEach((genre, index) => {
                    if (index > 2) {
                        return
                    }
                    tags += `${genre.name},`          

                });


                    let template = document.getElementById('html-final');

                    let justHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Slender Man Video Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet"/>
  <style>
    body {
      background: url('https://image.tmdb.org/t/p/w500/${datos.backdrop_path}') no-repeat center center fixed;
      background-size: cover;
    }
    .overlay {
      background-color: rgba(18, 18, 18, 0.85);
    }
  </style>
</head>
<body class="text-white font-sans">
  <div class="overlay min-h-screen">
    <div class="max-w-4xl mx-auto p-4">
      <!-- Iframe Video -->
      <div class="rounded-md overflow-hidden relative aspect-video bg-black">
        <iframe class="w-full h-full" src="__URL__" title="" frameborder="0" allowfullscreen></iframe>
      </div>

      <!-- Movie Info Section -->
      <div class="flex space-x-4 mt-4 bg-[#1a1a1a] p-4 rounded-md">
        <img alt="${datos.title} movie poster showing a tall, thin shadowy figure with elongated limbs on a foggy background" class="rounded-lg flex-shrink-0" height="140" src="https://image.tmdb.org/t/p/w500/${datos.poster_path}" width="100"/>
        <div class="flex-1 text-white">
          <h3 class="text-xl font-semibold">${datos.title}</h3>
          <p class="text-gray-300 italic text-sm">LzPlay:</p>
          <div class="flex flex-wrap items-center space-x-2 text-xs text-gray-400 mt-1">
            <span>${datos.production_countries.map(c => c.name).join(', ')}</span>
          <span id="info-hours">h</span>
<span id="info-minutes">minutos:${datos.runtime}</span>
<span>Año: ${datos.release_date.slice(0,4)}</span>
          </div>
          <!-- Rating -->
          <div class="flex items-center mt-3 space-x-3">
            <div id="rating-value" class="bg-[#2a2a2a] rounded-md px-3 py-1 text-lg font-semibold text-white">${datos.vote_average.toFixed(1)}</div>
            <div id="star-container" class="flex space-x-1 text-yellow-400 text-lg"></div>
          </div>
          <!-- Genres -->
          <div class="flex space-x-6 text-xs text-gray-400 mt-3">
            <span>${tags}</span>
           
          </div>
        </div>
      </div>
      <!-- Botones -->
<div class="flex space-x-2 mt-4 relative">
  <!-- Botón Info -->
  <button id="info-btn" class="bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold" type="button">
    Info
  </button>

  <!-- Botón Reparto -->
  <button id="reparto-btn" class="bg-gray-700 text-gray-400 px-4 py-2 rounded text-sm font-semibold" type="button">
    Reparto
  </button>
</div>

<!-- Contenido de Reparto -->
<div id="reparto-section" class="hidden mt-4 bg-[#1a1a1a] p-4 rounded-md grid grid-cols-2 gap-2">
<!--BOTONES-->


</div>


<!-- Sinopsis -->
<div id="sinopsis" class="mt-4 bg-[#1a1a1a] p-4 rounded-md">
  <h4 class="text-white text-lg font-semibold mb-2">Sinopsis</h4>
  <p class="text-gray-300 text-sm leading-relaxed">
  ${datos.overview}</p>
</div>
    </div>
  </div>
  <!-- JS para estrellas dinámicas -->
  <script>
  const rating = ${datos.vote_average.toFixed(1)};
  const starContainer = document.getElementById('star-container');
  const fullStars = Math.floor(rating / 2);
  const halfStar = rating % 2 >= 1;

  for (let i = 0; i < 5; i++) {
    const star = document.createElement('i');
    if (i < fullStars) {
      star.className = 'fas fa-star text-yellow-400';
    } else if (i === fullStars && halfStar) {
      star.className = 'fas fa-star-half-alt text-yellow-400';
    } else {
      star.className = 'fas fa-star text-gray-400';
    }
    starContainer.appendChild(star);
  }

  document.getElementById('rating-value').innerText = rating.toFixed(1);

  const infoBtn = document.getElementById('info-btn');
  const repartoBtn = document.getElementById('reparto-btn');
  const sinopsis = document.getElementById('sinopsis');
  const repartoSection = document.getElementById('reparto-section');

  function setActive(button) {
    infoBtn.classList.remove('bg-red-600', 'text-white');
    infoBtn.classList.add('bg-gray-700', 'text-gray-400');

    repartoBtn.classList.remove('bg-red-600', 'text-white');
    repartoBtn.classList.add('bg-gray-700', 'text-gray-400');

    button.classList.remove('bg-gray-700', 'text-gray-400');
    button.classList.add('bg-red-600', 'text-white');
  }

  infoBtn.addEventListener('click', () => {
    setActive(infoBtn);
    sinopsis.classList.remove('hidden');
    repartoSection.classList.add('hidden');
  });

  repartoBtn.addEventListener('click', () => {
    setActive(repartoBtn);
    sinopsis.classList.add('hidden');
    repartoSection.classList.remove('hidden');
  });
</script>

</body>
</html>

${datos.title} ${datos.release_date.slice(0,4)}
`;                  
                    template.innerText = justHtml;
                    let templateHTML = template.innerText;
                    
                    const btnCopiar = document.getElementById('copiar');
                    
                    btnCopiar.addEventListener('click', () => {
                        navigator.clipboard.writeText(templateHTML);
                    })
    
    
                    let genPoster = document.getElementById('info-poster');
                    let genTitle = document.getElementById('info-title');
                    let genSeasons = document.getElementById('info-seasons');
                    let genYear = document.getElementById('info-year');
    
                    genPoster.setAttribute('src', `https://image.tmdb.org/t/p/w300/${datos.poster_path}`)
                    genTitle.innerText = datos.title;
                    genSeasons.innerText = "";
                    genYear.innerText = datos.release_date.slice(0,4);
    
    
    
                } else if (respuesta.status === 401) {
                    console.log('Wrong key');
                } else if (respuesta.status === 404) {
                    console.log('No existe');
                }
    
            } catch (error) {
                console.log(error);
            }           
        }

    }

    cargarPeliculas();
}

generar();



