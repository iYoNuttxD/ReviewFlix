document.addEventListener('DOMContentLoaded', function() {
    const movieDatabase = {
        "avengers-endgame-2019": { title: "Vingadores: Ultimato (2019)", posterUrl: "https://m.media-amazon.com/images/I/816O7WbRGCL._AC_UF894,1000_QL80_.jpg", type: "movie", rating: 8.4, detailsUrl: "../Pagina de Filmes e Series/Details.html" },
        "a-origem-2010": { title: "A Origem (2010)", posterUrl: "https://images.justwatch.com/poster/241712232/s718/a-origem.jpg", type: "movie", rating: 8.8, detailsUrl: "../Pagina de Filmes e Series/Aorigem.html" },
        "homem-aranha-no-aranhaverso-2018": { title: "Homem-Aranha no Aranhaverso", posterUrl: "https://br.web.img3.acsta.net/pictures/18/12/05/16/28/3718855.jpg", type: "movie", rating: 8.4, detailsUrl: "../Pagina de Filmes e Series/Homemaranha.html"},
        "duna-2021": { title: "Duna (2021)", posterUrl: "https://ingresso-a.akamaihd.net/prd/img/movie/duna/509b75e4-2826-47aa-8a6e-127873685961.jpg", type: "movie", rating: 8.0, detailsUrl: "../Pagina de Filmes e Series/duna.html" },
        "forrest-gump-1994": { title: "Forrest Gump (1994)", posterUrl: "https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", type: "movie", rating: 8.8, detailsUrl: "../Pagina de Filmes e Series/forestgump.html" },
        "interestelar-2014": { title: "Interestelar (2014)", posterUrl: "https://br.web.img3.acsta.net/r_1920_1080/img/08/fe/08feaecbc56c480c082003c632f3bc2f.jpg", type: "movie", rating: 8.7, detailsUrl: "../Pagina de Filmes e Series/Interestelar.html" },
        "o-poderoso-chefao-1972": { title: "O Poderoso Chefão (1972)", posterUrl: "https://m.media-amazon.com/images/M/MV5BYTRmMjkwYzYtYTRiMi00NDJjLTk1NjctMDA3MjY2ZWIyMGQ5XkEyXkFqcGc@._V1_.jpg", type: "movie", rating: 9.2, detailsUrl: "../Pagina de Filmes e Series/Opoderosochefao.html" },
        "titanic-1997": { title: "Titanic (1997)", posterUrl: "https://m.media-amazon.com/images/I/91WlTjCgu4L.jpg", type: "movie", rating: 7.9, detailsUrl: "../Pagina de Filmes e Series/titanic.html" },
        
        "breaking-bad-2008": { title: "Breaking Bad (2008)", posterUrl: "https://br.web.img3.acsta.net/pictures/14/03/31/19/28/462555.jpg", type: "series", rating: 9.5, detailsUrl: "../Pagina de Filmes e Series/breakingbad.html" },
        "friends-1994": { title: "Friends (1994)", posterUrl: "https://m.media-amazon.com/images/M/MV5BOTU2YmM5ZjctOGVlMC00YTczLTljM2MtYjhlNGI5YWMyZjFkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", type: "series", rating: 8.9, detailsUrl: "../Pagina de Filmes e Series/friends.html" },
        "game-of-thrones-2011": { title: "Game of Thrones (2011)", posterUrl: "https://m.media-amazon.com/images/M/MV5BMTNhMDJmNmYtNDQ5OS00ODdlLWE0ZDAtZTgyYTIwNDY3OTU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", type: "series", rating: 9.3, detailsUrl: "../Pagina de Filmes e Series/got.html" },
        "stranger-things-2016": { title: "Stranger Things (2016)", posterUrl: "https://m.media-amazon.com/images/M/MV5BMjg2NmM0MTEtYWY2Yy00NmFlLTllNTMtMjVkZjEwMGVlNzdjXkEyXkFqcGc@._V1_.jpg", type: "series", rating: 8.7, detailsUrl: "../Pagina de Filmes e Series/strangerthings.html" },
        "ted-lasso-2020": { title: "Ted Lasso (2020)", posterUrl: "https://m.media-amazon.com/images/M/MV5BZmI3YWVhM2UtNDZjMC00YTIzLWI2NGUtZWIxODZkZjVmYTg1XkEyXkFqcGc@._V1_.jpg", type: "series", rating: 8.8, detailsUrl: "../Pagina de Filmes e Series/TedLasso.html" },
        "the-mandalorian-2019": { title: "The Mandalorian (2019)", posterUrl: "https://m.media-amazon.com/images/M/MV5BNjgxZGM0OWUtZGY1MS00MWRmLTk2N2ItYjQyZTI1OThlZDliXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", type: "series", rating: 8.7, detailsUrl: "../Pagina de Filmes e Series/themandalorian.html" },
        "the-office-2005": { title: "The Office (US) (2005)", posterUrl: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_.jpg", type: "series", rating: 9.0, detailsUrl: "../Pagina de Filmes e Series/theoffice.html" },
    };

    const upcomingMovies = [
        { title: "Avengers: Doomsday", posterUrl: "https://m.media-amazon.com/images/M/MV5BMGNiN2RlZTMtMTkyZC00YjkwLTgyY2QtMDg1ZDNhODQwNWM4XkEyXkFqcGc@._V1_.jpg" },
        { title: "Avengers: Secret Wars", posterUrl: "https://m.media-amazon.com/images/M/MV5BYTQyZTQ5MWQtN2M4NC00YWQwLTg3ZTctM2JiZDE4NDBkZDJkXkEyXkFqcGc@._V1_.jpg" },
        { title: "Superman: Legacy", posterUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQLg4YdXGQCAbHXYXS1J--GLO1W2YYKdvRWBjPUsn4KB8MrIhv2" },
        { title: "F1", posterUrl: "https://m.media-amazon.com/images/M/MV5BNGI0MDI4NjEtOWU3ZS00ODQyLWFhYTgtNGYxM2ZkM2Q2YjE3XkEyXkFqcGc@._V1_.jpg" },
        { title: "Tron: Ares", posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdMa8Wc2EeO3pNz2aFBmmWcRRJQvsrbbOc1YRjst4DYPteTTPB" },
        { title: "Shrek 5", posterUrl: "https://m.media-amazon.com/images/M/MV5BNmNkNmRkNDAtOTMzNC00MWYzLWJhNjMtYjNkZTNjODVhOTg2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { title: "Five Nights at Freddy's 2", posterUrl: "https://m.media-amazon.com/images/M/MV5BZjkwYzE2OTQtNGZiZC00M2UyLWJjNTEtMTMxNDgwMzY1N2RkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" }
    ];

    const moviesContainer = document.getElementById('movies-list');
    const seriesContainer = document.getElementById('series-list');
    const upcomingContainer = document.getElementById('upcoming-list');
    const searchInput = document.getElementById('search-input');

    // --- FUNÇÃO ATUALIZADA ---
    function createMovieItem(movie) {
        const itemLink = document.createElement('a');
        itemLink.href = movie.detailsUrl || "#"; 
        itemLink.className = 'movie-list-item';
        itemLink.setAttribute('data-title', movie.title.toLowerCase());

        let ratingHtml = '';
        if (movie.rating) {
            let ratingClass = 'rating-medium';
            if (movie.rating >= 8.0) {
                ratingClass = 'rating-high';
            } else if (movie.rating < 5.0) {
                ratingClass = 'rating-low';
            }
            
            ratingHtml = `
                <div class="item-rating">
                    <div class="rating-score-box ${ratingClass}">
                        <span>${movie.rating.toFixed(1)}</span>
                    </div>
                </div>
            `;
        }

        itemLink.innerHTML = `
            <img src="${movie.posterUrl}" alt="Pôster de ${movie.title}">
            <div class="item-info">
                <h4>${movie.title}</h4>
                ${ratingHtml}
            </div>
        `;
        return itemLink;
    }

    function populateLists() {
        moviesContainer.innerHTML = '';
        seriesContainer.innerHTML = '';
        upcomingContainer.innerHTML = '';

        for (const id in movieDatabase) {
            const item = movieDatabase[id];
            if (item.type === 'movie') {
                moviesContainer.appendChild(createMovieItem(item));
            } else if (item.type === 'series') {
                seriesContainer.appendChild(createMovieItem(item));
            }
        }

        upcomingMovies.forEach(movie => {
            upcomingContainer.appendChild(createMovieItem(movie));
        });
    }

    function filterContent() {
        const query = searchInput.value.toLowerCase();
        document.querySelectorAll('.movie-list-item').forEach(item => {
            const title = item.dataset.title;
            if (title.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function setupHorizontalScroll(listId, prevBtnId, nextBtnId) {
        const list = document.getElementById(listId);
        const prev = document.getElementById(prevBtnId);
        const next = document.getElementById(nextBtnId);
        if (!list || !prev || !next) return;

        const updateButtons = () => {
            if(!list.offsetParent) return;
            const maxScroll = list.scrollWidth - list.clientWidth;
            prev.style.display = list.scrollLeft > 10 ? 'flex' : 'none';
            next.style.display = list.scrollLeft < maxScroll - 10 ? 'flex' : 'none';
        };
        
        prev.addEventListener('click', () => list.scrollBy({ left: -300, behavior: 'smooth' }));
        next.addEventListener('click', () => list.scrollBy({ left: 300, behavior: 'smooth' }));
        list.addEventListener('scroll', updateButtons);
        new ResizeObserver(updateButtons).observe(list);
        
        const observer = new MutationObserver(() => {
            updateButtons();
            observer.disconnect();
        });
        observer.observe(list, { childList: true });
        
        setTimeout(updateButtons, 500);
    }
    
    searchInput.addEventListener('input', filterContent);

    populateLists();
    setupHorizontalScroll('movies-list', 'moviesPrevBtn', 'moviesNextBtn');
    setupHorizontalScroll('series-list', 'seriesPrevBtn', 'seriesNextBtn');
    setupHorizontalScroll('upcoming-list', 'upcomingPrevBtn', 'upcomingNextBtn');
});