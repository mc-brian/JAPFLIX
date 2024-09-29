let movies = [];
const API_URL = 'https://japceibal.github.io/japflix_api/movies-data.json';

// Para cargar las películas desde la API
async function loadMovies() {
    try {
        const response = await fetch(API_URL);
        movies = await response.json();
        console.log('Películas cargadas:', movies.length);
    } catch (error) {
        console.error('Error al cargar las películas:', error);
    }
}

// Función para buscar películas
function searchMovies(query) {
    return movies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.genres.some(genre => genre.name.toLowerCase().includes(query.toLowerCase())) ||
        movie.tagline.toLowerCase().includes(query.toLowerCase()) ||
        movie.overview.toLowerCase().includes(query.toLowerCase())
    );
}

// Función para mostrar las pelis
function displayMovies(movies) {
    const movieList = document.getElementById('lista');
    movieList.innerHTML = '';
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.className = 'list-group-item bg-dark text-white';
        li.innerHTML = `
            <h5>${movie.title}</h5>
            <p>${movie.tagline}</p>
            <div>${renderStars(movie.vote_average)}</div>
        `;
        li.addEventListener('click', () => showMovieDetails(movie));
        movieList.appendChild(li);
    });
}

// Estrellas de calificación
function renderStars(rating) {
    const stars = Math.round(rating / 2);
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
}

// Detalles de una película
function showMovieDetails(movie) {
    const offcanvasElement = document.getElementById('offcanvasTop');
    const offcanvasBody = offcanvasElement.querySelector('.offcanvas-body');
    
    offcanvasBody.innerHTML = `
        <div class="container-fluid">
            <h2>${movie.title}</h2>
            <p class="text-muted">${movie.tagline}</p>
            <p>${movie.overview}</p>
            <p><strong>Géneros:</strong> ${movie.genres.map(genre => genre.name).join(', ')}</p>
            <div class="dropdown mt-3">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    Más información
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><a class="dropdown-item" href="#">Año: ${new Date(movie.release_date).getFullYear()}</a></li>
                    <li><a class="dropdown-item" href="#">Duración: ${movie.runtime} min</a></li>
                    <li><a class="dropdown-item" href="#">Presupuesto: $${movie.budget.toLocaleString()}</a></li>
                    <li><a class="dropdown-item" href="#">Ganancias: $${movie.revenue.toLocaleString()}</a></li>
                </ul>
            </div>
        </div>
    `;
    
    const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
    offcanvas.show();
}

// Event Listeners (agregué el del enter porque nos resulta muy intuitivo ya buscar cosas de esa forma. También tuve problemas en la carga así que para
// asegurarme de que el script estaba funcionando busqué tener una respuesta en consola.)
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, iniciando carga de películas...');
    await loadMovies();
    
    const searchButton = document.getElementById('btnBuscar');
    const searchInput = document.getElementById('inputBuscar');
    
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            console.log('Buscando:', query);
            const results = searchMovies(query);
            console.log('Resultados encontrados:', results.length);
            displayMovies(results);
        }
    });
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                const results = searchMovies(query);
                displayMovies(results);
            }
        }
    });
});

console.log('el script se carga, si no funciona el problema es otro');