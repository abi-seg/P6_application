document.addEventListener('DOMContentLoaded', () => {
    fetchBestMovie();
    fetchTopRatedMovies();
    fetchMoviesByCategory('Action', 'action');
    fetchMoviesByCategory('Comedy', 'comedie');
    fetchMoviesByCategory('Drama', 'Drame'); // Removed extra comma

    // For the dropdown in "Autre catégories"
    const select = document.getElementById('choix-categorie');
    select.addEventListener('change', (event) => {
        fetchMoviesByCategory(event.target.value, 'Autre-categories');
    });
});

// Fetch and display the best movie
function fetchBestMovie() {
    fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score')
        .then(response => response.json())
        .then(data => {
            const bestMovie = data.results[0];
            displayBestMovie(bestMovie);
        })
        .catch(error => console.error('Erreur lors du chargement du meilleur film:', error));
}

function displayBestMovie(movie) {
    const section = document.getElementById('meilleur-film');
    section.innerHTML = `
        <h2>Meilleur Film</h2>
        <img src="${movie.image_url}" alt="Affiche du meilleur film">
        <h3>${movie.title}</h3>
        <button>Détails</button>
        <p>${movie.description}</p>
    `;
}

// Fetch and display top-rated movies (excluding the best movie)
function fetchTopRatedMovies() {
    fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score')
        .then(response => response.json())
        .then(data => {
            // Remove the best movie (first one)
            const movies = data.results.slice(1, 7); // Next 6 top-rated movies
            displayMovies(movies, 'films-mieux-notes');
        })
        .catch(error => console.error('Erreur lors du chargement des films les mieux notés:', error));
}

// Fetch and display movies by category
function fetchMoviesByCategory(category, sectionID) {
    fetch(`http://localhost:8000/api/v1/titles/?genre=${category}&sort_by=-imdb_score`)
        .then(response => response.json())
        .then(data => {
            const movies = data.results.slice(0, 6); // Show top 6
            displayMovies(movies, sectionID);
        })
        .catch(error => console.error(`Erreur lors du chargement des films de la catégorie ${category}:`, error));
}

// Display movies in a section
function displayMovies(movies, sectionID) {
    const section = document.getElementById(sectionID);
    const list = section.querySelector('.liste-films'); // Fixed class name
    list.innerHTML = ''; // Clear previous content
    movies.forEach(movie => {
        const article = document.createElement('article');
        article.innerHTML = `
            <img src="${movie.image_url}" alt="Affiche du film ${movie.title}">
            <h4>${movie.title}</h4>
            <button>Détails</button>
        `;
        list.appendChild(article);
    });
}