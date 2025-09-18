document.addEventListener('DOMContentLoaded', () => {
    fetchBestMovie();
    fetchTopRatedMovies();
    fetchMoviesByCategory('Action', 'action');
    fetchMoviesByCategory('Comedy', 'comedie');
    fetchMoviesByCategory('Drama', 'drame');
    fetchAndFillCategories();

    // For the dropdown in "Autre catégories"
    const select = document.getElementById('choix-categorie');
    if (select) {
        select.addEventListener('change', (event) => {
        fetchMoviesByCategory(event.target.value, 'autres-categories');
    });
}
});
function fetchAndFillCategories() {
   fetch('http://localhost:8000/api/v1/genres/')
   .then(response=>response.json())
   .then(data => {
    const select = document.getElementById('choix-categorie');
    select.innerHTML = ''; //clear old options
    data.results.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.name;
        option.textContent = genre.name;
        select.appendChild(option);
    });
   });
}
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
    fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7')
        .then(response => response.json())
        .then(data => {
            const movies = data.results.slice(1, 7);
            displayMovies(movies, 'films-mieux-notes');
        })
        .catch(error => console.error('Erreur lors du chargement des films les mieux notés:', error));
}

// Fetch and display movies by category
function fetchMoviesByCategory(category, sectionID) {
    fetch(`http://localhost:8000/api/v1/titles/?genre=${category}&sort_by=-imdb_score&page_size=6`)
        .then(response => response.json())
        .then(data => {
            
            displayMovies(data.results, sectionID);
        })
        .catch(error => console.error(`Erreur lors du chargement des films de la catégorie ${category}:`, error));
}

// Display movies in a section (with defensive checks)
function displayMovies(movies, sectionID) {
    const section = document.getElementById(sectionID);
    if (!section) {
        console.error(`Section with ID "${sectionID}" not found in HTML.`);
        return;
    }
    const list = section.querySelector('.liste-films');
    if (!list) {
        console.error(`No .liste-films div found in section "${sectionID}".`);
        return;
    }
    list.innerHTML = '';
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
function updateVisibleMovies(list, showAll = true) {
    const articles = list.querySelectorAll('article');
    articles.forEach(article => article.classList.remove('film-cache'));
}


document.querySelectorAll('.liste-films').forEach(list => {
    updateVisibleMovies(list, false); //Affichage par défaut
    const voirPlusBtn = list.parentElement.querySelector('.voir-plus');
    if (voirPlusBtn) {
        voirPlusBtn.onclick = function() {
            const isShowingAll = voirPlusBtn.textContent === "Voir moins";
            updateVisibleMovies(list, !isShowingAll);
            voirPlusBtn.textContent = isShowingAll ? "Voir plus" : "Voir moins"

        };
    }
});
//Adapter l'affichage lors du redimensionnement de la fenetre
window.addEventListener('resize',() => {
    document.querySelectorAll('.liste-films').forEach(list => {
        const voirPlusBtn = list.parentElement.querySelector('.Voir-plus');
        if (voirPlusBtn && voirPlusBtn.textContent === "Voir plus") {
            updateVisibleMovies(list, false);
        }
    });
});
document.body.addEventListener('click', function(e){
    if(e.target.closest('.liste-films article')){
        document.getElementById('modal').style.display ='flex';
        document.getElementById('modal-body').innerHTML = "<b> Infos du film ici </b>";

    }
    if (e.target.matches('.close, .modal')) {
        document.getElementById('modal').style.display = 'none';
    }
});