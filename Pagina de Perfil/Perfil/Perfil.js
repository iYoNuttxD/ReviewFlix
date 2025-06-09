document.addEventListener('DOMContentLoaded', function () {
    const activeUserEmail = localStorage.getItem('reviewFlixActiveUserEmail');
    if (!activeUserEmail) {
        alert('Você não está logado.');
        window.location.href = '../Login/Login.html';
        return; 
    }
    let allUsersData = JSON.parse(localStorage.getItem('reviewFlixAllUsers')) || {};
    let currentUser = allUsersData[activeUserEmail];
    if (!currentUser) {
        alert('Erro ao carregar dados do usuário.');
        window.location.href = '../Login/Login.html';
        return;
    }
    
    function loadUserProfileData() {
        const fullNameField = document.getElementById('fullName');
        const emailField = document.getElementById('email');
        const birthDateField = document.getElementById('birthDate');
        const profilePicImg = document.getElementById('profilePicImg');
        if(fullNameField) fullNameField.value = currentUser.fullName || '';
        if(emailField) emailField.value = currentUser.email || ''; 
        if(birthDateField) birthDateField.value = currentUser.birthDate || '';
        if (profilePicImg && currentUser.profilePic) {
            profilePicImg.src = currentUser.profilePic;
        } else if (profilePicImg) {
            profilePicImg.src = 'https://placehold.co/150x150?text=Foto'; 
        }
    }

    const editInfoBtn = document.getElementById('editInfoBtn');
    const saveInfoBtn = document.getElementById('saveInfoBtn');
    const userInfoForm = document.getElementById('userInfoForm');
    if (editInfoBtn) {
        editInfoBtn.addEventListener('click', function () {
            userInfoForm.querySelectorAll('input:not(#email)').forEach(input => input.disabled = false);
            editInfoBtn.style.display = 'none';
            saveInfoBtn.style.display = 'inline-block';
        });
    }
    if (userInfoForm) {
        userInfoForm.addEventListener('submit', function (event) {
            event.preventDefault(); 
            currentUser.fullName = document.getElementById('fullName').value;
            currentUser.birthDate = document.getElementById('birthDate').value;
            if (document.getElementById('profilePicImg').src.startsWith('data:image')) {
                currentUser.profilePic = document.getElementById('profilePicImg').src;
            }
            allUsersData[activeUserEmail] = currentUser;
            localStorage.setItem('reviewFlixAllUsers', JSON.stringify(allUsersData)); 
            userInfoForm.querySelectorAll('input:not(#email)').forEach(input => input.disabled = true);
            saveInfoBtn.style.display = 'none';
            editInfoBtn.style.display = 'inline-block';
            alert('Informações atualizadas!');
        });
    }

    const changePicBtn = document.getElementById('changePicBtn');
    const profilePicUpload = document.getElementById('profilePicUpload');
    if(changePicBtn) {
        changePicBtn.addEventListener('click', () => profilePicUpload.click());
    }
    if(profilePicUpload) {
        profilePicUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => document.getElementById('profilePicImg').src = e.target.result;
                reader.readAsDataURL(file);
            }
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('reviewFlixActiveUserEmail'); 
            alert('Você foi deslogado.');
            window.location.href = '../Login/Login.html';
        });
    }

    // --- Bloco 2: Lógica das Listas Dinâmicas ---
    let movieReviews = JSON.parse(localStorage.getItem('reviewFlixMovieReviews')) || {};
    let currentlyEditingReviewId = null;
    const movieDatabase = {
        "avengers-endgame-2019": { title: "Vingadores: Ultimato (2019)", posterUrl: "https://m.media-amazon.com/images/I/816O7WbRGCL._AC_UF894,1000_QL80_.jpg" },
        "a-origem-2010": { title: "A Origem (2010)", posterUrl: "https://br.web.img2.acsta.net/c_300_300/img/e5/aa/e5aa44fd2ca36fa73bb5f4fc46f92d73.jpg" },
        "breaking-bad-2008": { title: "Breaking Bad (2008)", posterUrl: "https://br.web.img3.acsta.net/pictures/14/03/31/19/28/462555.jpg" },
        "homem-aranha-no-aranhaverso-2018": { title: "Homem-Aranha no Aranhaverso (2018)", posterUrl: "https://br.web.img3.acsta.net/pictures/18/12/05/16/28/3718855.jpg" },
        "duna-2021": { title: "Duna (2021)", posterUrl: "https://ingresso-a.akamaihd.net/prd/img/movie/duna/509b75e4-2826-47aa-8a6e-127873685961.jpg" },
        "forrest-gump-1994": { title: "Forrest Gump (1994)", posterUrl: "https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        "friends-1994": { title: "Friends (1994)", posterUrl: "https://m.media-amazon.com/images/M/MV5BOTU2YmM5ZjctOGVlMC00YTczLTljM2MtYjhlNGI5YWMyZjFkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        "game-of-thrones-2011": { title: "Game of Thrones (2011)", posterUrl: "https://m.media-amazon.com/images/M/MV5BMTNhMDJmNmYtNDQ5OS00ODdlLWE0ZDAtZTgyYTIwNDY3OTU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        "interestelar-2014": { title: "Interestelar (2014)", posterUrl: "https://br.web.img3.acsta.net/r_1920_1080/img/08/fe/08feaecbc56c480c082003c632f3bc2f.jpg" },
        "o-poderoso-chefao-1972": { title: "O Poderoso Chefão (1972)", posterUrl: "https://m.media-amazon.com/images/M/MV5BYTRmMjkwYzYtYTRiMi00NDJjLTk1NjctMDA3MjY2ZWIyMGQ5XkEyXkFqcGc@._V1_.jpg" },
        "stranger-things-2016": { title: "Stranger Things (2016)", posterUrl: "https://m.media-amazon.com/images/M/MV5BMjg2NmM0MTEtYWY2Yy00NmFlLTllNTMtMjVkZjEwMGVlNzdjXkEyXkFqcGc@._V1_.jpg" },
        "ted-lasso-2020": { title: "Ted Lasso (2020)", posterUrl: "https://m.media-amazon.com/images/M/MV5BZmI3YWVhM2UtNDZjMC00YTIzLWI2NGUtZWIxODZkZjVmYTg1XkEyXkFqcGc@._V1_.jpg" },
        "the-mandalorian-2019": { title: "The Mandalorian (2019)", posterUrl: "https://m.media-amazon.com/images/M/MV5BNjgxZGM0OWUtZGY1MS00MWRmLTk2N2ItYjQyZTI1OThlZDliXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        "the-office-2005": { title: "The Office (US) (2005)", posterUrl: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_.jpg" },
        "titanic-1997": { title: "Titanic (1997)", posterUrl: "https://m.media-amazon.com/images/I/91WlTjCgu4L.jpg" }
    };
    const reviewsContainer = document.getElementById('reviews-container');

    let selectionMode = { active: false, action: null, targetListId: null, selectedIds: [] };

    function enterSelectionMode(action, targetListId) {
        selectionMode.active = true;
        selectionMode.action = action;
        selectionMode.targetListId = targetListId;
        selectionMode.selectedIds = [];
        updateSelectionUI();
    }

    function exitSelectionMode() {
        selectionMode.active = false;
        selectionMode.action = null;
        selectionMode.targetListId = null;
        selectionMode.selectedIds = [];
        updateSelectionUI();
        loadMovieLists(); 
    }

    function updateSelectionUI() {
        document.querySelectorAll('.movies-list').forEach(list => {
            const listContainer = list.closest('.card');
            if (selectionMode.active && list.id === selectionMode.targetListId) {
                listContainer.querySelectorAll('.movie-list-item').forEach(item => item.classList.add('selectable'));
            } else {
                listContainer.querySelectorAll('.movie-list-item').forEach(item => {
                    item.classList.remove('selectable', 'selected');
                });
            }
        });
        document.querySelectorAll('.section-header-actions').forEach(header => {
            if (!header.closest('.card').querySelector('.movies-list')) return;
            const listId = header.closest('.card').querySelector('.movies-list').id;
            const optionsTrigger = header.querySelector('.section-options-trigger');
            let actionsContainer = header.querySelector('.selection-mode-actions');

            if (selectionMode.active && listId === selectionMode.targetListId) {
                if (optionsTrigger) optionsTrigger.style.display = 'none';
                if (!actionsContainer) {
                    actionsContainer = document.createElement('div');
                    actionsContainer.className = 'selection-mode-actions';
                    actionsContainer.innerHTML = `
                        <button class="btn btn-secondary btn-cancel-selection">Cancelar</button>
                        <button class="btn btn-primary btn-confirm-selection">Confirmar</button>
                    `;
                    header.appendChild(actionsContainer);
                }
            } else {
                if (optionsTrigger) optionsTrigger.style.display = 'block';
                if (actionsContainer) actionsContainer.remove();
            }
        });
    }

    function toggleMovieSelection(movieItem) {
        if (!selectionMode.active || !movieItem.classList.contains('selectable')) return;
        const movieId = movieItem.dataset.movieId;
        const isSelected = movieItem.classList.toggle('selected');
        if (isSelected) {
            selectionMode.selectedIds.push(movieId);
        } else {
            const index = selectionMode.selectedIds.indexOf(movieId);
            if (index > -1) selectionMode.selectedIds.splice(index, 1);
        }
    }

    function executeSelectionAction() {
        if (selectionMode.selectedIds.length === 0) {
            alert("Nenhum filme selecionado.");
            exitSelectionMode();
            return;
        }
        const { action, selectedIds } = selectionMode;
        if (action === 'remove-watched') {
            currentUser.watched = currentUser.watched.filter(id => !selectedIds.includes(id));
        } else if (action === 'remove-watchlist') {
            currentUser.watchlist = currentUser.watchlist.filter(id => !selectedIds.includes(id));
        } else if (action === 'move-to-watched') {
            currentUser.watchlist = currentUser.watchlist.filter(id => !selectedIds.includes(id));
            selectedIds.forEach(id => {
                if (!currentUser.watched.includes(id)) currentUser.watched.push(id);
            });
        }
        allUsersData[activeUserEmail] = currentUser;
        localStorage.setItem('reviewFlixAllUsers', JSON.stringify(allUsersData));
        exitSelectionMode();
    }

    function loadUserReviews() {
        if (!reviewsContainer) return;
        reviewsContainer.innerHTML = '';
        const userReviews = currentUser.reviews || [];
        if (userReviews.length === 0) {
            reviewsContainer.innerHTML = `<p style="text-align:center; color:#888; padding: 20px 0;">Você ainda não fez nenhuma avaliação.</p>`;
            return;
        }
        userReviews.forEach(review => {
            const reviewElement = (review.reviewId === currentlyEditingReviewId)
                ? createReviewEditForm(review)
                : createReviewDisplayElement(review);
            reviewsContainer.appendChild(reviewElement);
        });
    }

    function createReviewDisplayElement(review) {
        const div = document.createElement('div');
        div.className = 'review-item';
        div.setAttribute('data-review-id', review.reviewId);
        div.setAttribute('data-movie-id', review.movieId);
        const movieData = movieDatabase[review.movieId];
        const posterUrl = movieData ? movieData.posterUrl : 'https://placehold.co/80x120?text=Poster';
        const ratingClass = review.score >= 8 ? 'rating-high' : review.score >= 6 ? 'rating-medium' : 'rating-low';
        div.innerHTML = `
            <img src="${posterUrl}" alt="Poster de ${review.movieTitle}">
            <div class="review-item-content">
                <div class="review-options-container">
                    <button class="options-btn" aria-label="Opções"><i class="fas fa-ellipsis-h"></i></button>
                    <div class="options-menu">
                        <button class="menu-option edit-review-btn">Editar avaliação</button>
                        <button class="menu-option delete-review-btn">Remover avaliação</button>
                    </div>
                </div>
                <h4>${review.movieTitle}</h4>
                <div class="user-rating-container">
                    <span class="rating-label">Sua Nota:</span>
                    <div class="rating-score-box ${ratingClass}"><span>${review.score}</span></div>
                    <span class="rating-max">/10</span>
                </div>
                <p class="review-text-sample">${review.comment}</p>
                <div class="review-item-actions">
                    <button class="action-btn" disabled><i class="fas fa-thumbs-up"></i> <span>${review.likedBy?.length || 0}</span></button>
                    <button class="action-btn" disabled><i class="fas fa-thumbs-down"></i> <span>${review.dislikedBy?.length || 0}</span></button>
                </div>
            </div>`;
        return div;
    }

    function createReviewEditForm(review) {
        const div = document.createElement('div');
        div.className = 'review-item';
        div.setAttribute('data-review-id', review.reviewId);
        div.setAttribute('data-movie-id', review.movieId);
        const movieData = movieDatabase[review.movieId];
        const posterUrl = movieData ? movieData.posterUrl : 'https://placehold.co/80x120?text=Poster';
        div.innerHTML = `
            <img src="${posterUrl}" alt="Poster de ${review.movieTitle}">
            <div class="review-item-content">
                <h4>Editando: ${review.movieTitle}</h4>
                <form class="editing-form">
                    <div class="form-group">
                        <label for="edit-score-${review.reviewId}">Sua Nota (0-10):</label>
                        <input type="number" id="edit-score-${review.reviewId}" value="${review.score}" min="0" max="10" step="0.1" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-comment-${review.reviewId}">Seu Comentário:</label>
                        <textarea id="edit-comment-${review.reviewId}" required>${review.comment}</textarea>
                    </div>
                    <div class="edit-actions">
                        <button type="button" class="btn btn-secondary btn-cancel-edit">Cancelar</button>
                        <button type="submit" class="btn btn-primary btn-save-edit">Salvar</button>
                    </div>
                </form>
            </div>`;
        return div;
    }
    
    function loadMovieLists() {
        renderMovieList('watched', 'watchedMoviesList');
        renderMovieList('watchlist', 'watchlistMoviesList');
    }

    function renderMovieList(listType, containerId) {
        const container = document.getElementById(containerId);
        if(!container) return;
        container.innerHTML = '';
        currentUser[listType] = currentUser[listType] || [];
        const movieList = currentUser[listType];
        if (movieList.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#888; width:100%; padding: 20px 0;">Nenhum filme nesta lista.</p>`;
            return;
        }
        movieList.forEach(movieId => {
            const movieData = movieDatabase[movieId];
            if (movieData) container.appendChild(createMovieListItemElement(movieId, movieData));
        });
    }

    function createMovieListItemElement(movieId, movieData) {
        const div = document.createElement('div');
        div.className = 'movie-list-item';
        div.setAttribute('data-movie-id', movieId);
        div.innerHTML = `<div class="movie-poster-container"><img src="${movieData.posterUrl}" alt="Poster de ${movieData.title}"></div><h4>${movieData.title}</h4>`;
        return div;
    }
    
    document.body.addEventListener('click', function(event) {
        const optionsBtn = event.target.closest('.options-btn');
        if (optionsBtn) {
            event.stopPropagation();
            const menu = optionsBtn.nextElementSibling;
            const isMenuActive = menu.classList.contains('active');
            document.querySelectorAll('.options-menu.active').forEach(m => m.classList.remove('active'));
            if (!isMenuActive) menu.classList.add('active');
            return;
        }

        if (selectionMode.active) {
            if (event.target.closest('.movie-list-item')) {
                toggleMovieSelection(event.target.closest('.movie-list-item'));
            } else if (event.target.matches('.btn-confirm-selection')) {
                executeSelectionAction();
            } else if (event.target.matches('.btn-cancel-selection')) {
                exitSelectionMode();
            }
        }

        const menuOption = event.target.closest('.menu-option');
        if (menuOption) {
            if (menuOption.dataset.action) {
                const card = menuOption.closest('.card');
                const listId = card.querySelector('.movies-list').id;
                enterSelectionMode(menuOption.dataset.action, listId);
            } else if (event.target.closest('.review-options-container')) {
                const reviewItem = event.target.closest('.review-item');
                const reviewId = reviewItem.dataset.reviewId;
                if (event.target.matches('.edit-review-btn')) {
                    currentlyEditingReviewId = reviewId;
                    loadUserReviews();
                } else if (event.target.matches('.delete-review-btn')) {
                    if (confirm("Tem certeza que deseja remover esta avaliação?")) {
                        const movieId = reviewItem.dataset.movieId;
                        currentUser.reviews = currentUser.reviews.filter(r => r.reviewId !== reviewId);
                        if (movieReviews[movieId]) {
                            movieReviews[movieId] = movieReviews[movieId].filter(r => r.reviewId !== reviewId);
                        }
                        allUsersData[activeUserEmail] = currentUser;
                        localStorage.setItem('reviewFlixAllUsers', JSON.stringify(allUsersData));
                        localStorage.setItem('reviewFlixMovieReviews', JSON.stringify(movieReviews));
                        loadUserReviews();
                    }
                }
            }
        }
        
        const editForm = event.target.closest('.editing-form');
        if(editForm) {
            if (event.target.matches('.btn-cancel-edit')) {
                currentlyEditingReviewId = null;
                loadUserReviews();
            } else if (event.target.matches('.btn-save-edit')) {
                event.preventDefault();
                const reviewItem = event.target.closest('.review-item');
                const reviewId = reviewItem.dataset.reviewId;
                const movieId = reviewItem.dataset.movieId;
                const newScore = document.getElementById(`edit-score-${reviewId}`).value;
                const newComment = document.getElementById(`edit-comment-${reviewId}`).value;
                const reviewInUser = currentUser.reviews.find(r => r.reviewId === reviewId);
                if (reviewInUser) {
                    reviewInUser.score = newScore;
                    reviewInUser.comment = newComment;
                }
                if (movieReviews[movieId]) {
                    const reviewInGeneral = movieReviews[movieId].find(r => r.reviewId === reviewId);
                    if(reviewInGeneral) {
                        reviewInGeneral.score = newScore;
                        reviewInGeneral.comment = newComment;
                    }
                }
                allUsersData[activeUserEmail] = currentUser;
                localStorage.setItem('reviewFlixAllUsers', JSON.stringify(allUsersData));
                localStorage.setItem('reviewFlixMovieReviews', JSON.stringify(movieReviews));
                currentlyEditingReviewId = null;
                loadUserReviews();
            }
        }
        
        if (!event.target.closest('.options-menu') && !optionsBtn) {
            document.querySelectorAll('.options-menu.active').forEach(menu => menu.classList.remove('active'));
        }
    });

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
        prev.addEventListener('click', () => list.scrollBy({ left: -270, behavior: 'smooth' }));
        next.addEventListener('click', () => list.scrollBy({ left: 270, behavior: 'smooth' }));
        list.addEventListener('scroll', updateButtons);
        new ResizeObserver(updateButtons).observe(list);
        setTimeout(updateButtons, 200);
    }
    
    loadUserProfileData();
    loadUserReviews();
    loadMovieLists();
    setupHorizontalScroll('watchedMoviesList', 'watchedPrevBtn', 'watchedNextBtn');
    setupHorizontalScroll('watchlistMoviesList', 'watchlistPrevBtn', 'watchlistNextBtn');
});