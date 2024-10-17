const apiKey = '741cee757b4b4235bfd9f7596906168a';
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

// Fetch and display popular movies
async function fetchPopularMovies() {
    const url = `${apiUrl}/movie/popular?api_key=${apiKey}&language=es-ES&page=1`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al obtener las películas: ${response.status}`);
        }
        const data = await response.json();// Lista de películas populares
        displayMovies(data.results);      // y llama a displayMovies con los resultados
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// Display movies
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpia la lista de películas
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        li.style.listStyleType = 'none';
        li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic en la película
        movieList.appendChild(li);
    });
}


// Show movie details
async function showMovieDetails(movieId) {
    const url = `${apiUrl}/movie/${movieId}?api_key=${apiKey}&language=es-ES`;
    detailsContainer.innerHTML = ''; //limpia el contenedor
    try {
        const response = await fetch(url);// tu codigo aqui: realiza una solicitud para obtener los detalles de la película
        if (!response.ok) {
            throw new Error(`Error al obtener detalles de la película: ${response.status}`);
        }
        const datadetails = await response.json(); 
        movieDetails.style.display = 'block';

        let ul = document.createElement('ul');
        detailsContainer.appendChild(ul);

        let liMovie = document.createElement("li");
        liMovie.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${datadetails.poster_path}" alt="${datadetails.title}">
            <br>
            <span><br>${datadetails.title}</span><br>
            <br>
        `;
        ul.appendChild(liMovie);

        let liDetails = document.createElement("li");
        liDetails.innerText = datadetails.overview;
        ul.appendChild(liDetails);// y actualiza el contenedor de detalles con la información de la película

        let liReleaseDate = document.createElement("li");
        liReleaseDate.innerText = 'Fecha de lanzamiento: ' + datadetails.release_date;
        ul.appendChild(liReleaseDate);

        ul.style.listStyleType = 'none';

        selectedMovieId = datadetails;
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Search movies
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        try {
            const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }

            const data = await response.json();
            const peliculas = data.results;// tu codigo aqui: realiza una solicitud para buscar películas
            displayMovies(peliculas);// y llama a displayMovies con los resultados de la búsqueda
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    }
});

// Add movie to favorites
addToFavoritesButton.addEventListener('click', () => {
    console.log(selectedMovieId);
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: selectedMovieId.title
        };
        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Guarda en localStorage
            displayFavorites(); // Muestra la lista actualizada de favoritos
        }
    }
});

// Display favorite movies
function displayFavorites() {
    favoritesList.innerHTML = ''; // Limpia la lista de favoritos
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesList.appendChild(li);
    });
}

// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas
 