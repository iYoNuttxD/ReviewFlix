document.addEventListener('DOMContentLoaded', function () {
    const movieId = document.body.getAttribute('data-movie-id');
    const movieTitle = document.querySelector('.title-header h1').textContent;

    const watchedBtn = document.getElementById('watchedBtn');
    const watchlistBtn = document.getElementById('watchlistBtn');
    const watchlistIcon = document.getElementById('watchlistIcon');
    const watchlistText = document.getElementById('watchlistText');
    
    const reviewForm = document.getElementById('review-form');
    const reviewFormSection = document.querySelector('.review-form-section');
    const reviewFormTitle = reviewFormSection.querySelector('h3');
    const formButtonsContainer = document.getElementById('form-buttons-container');
    const reviewFormSubmitBtn = reviewForm.querySelector('.btn-submit-review');
    const reviewsListContainer = document.getElementById('reviews-list-container');

    const activeUserEmail = localStorage.getItem('reviewFlixActiveUserEmail');
    let allUsersData = JSON.parse(localStorage.getItem('reviewFlixAllUsers')) || {};
    let movieReviews = JSON.parse(localStorage.getItem('reviewFlixMovieReviews')) || {};
    let currentUser = activeUserEmail ? allUsersData[activeUserEmail] : null;
    
    let isEditMode = false;
    let reviewBeingEditedId = null;

    function initializePage() {
        if (currentUser) {
            setupLoggedInState();
        } else {
            setupLoggedOutState();
        }
        loadAndRenderReviews();
    }

    function setupLoggedOutState() {
        [watchedBtn, watchlistBtn].forEach(btn => {
            btn.disabled = true;
            const textSpan = btn.querySelector('span');
            if(textSpan) textSpan.textContent = 'Precisa estar logado';
        });
        reviewFormSubmitBtn.disabled = true;
        reviewFormSubmitBtn.textContent = 'Faça login para avaliar';
    }

    function setupLoggedInState() {
        watchedBtn.addEventListener('click', () => toggleListItem('watched'));
        watchlistBtn.addEventListener('click', () => toggleListItem('watchlist'));
        reviewForm.addEventListener('submit', handleReviewSubmit);
        reviewsListContainer.addEventListener('click', handleReviewActions);
        updateButtonsState();
    }
    
    function updateButtonsState() {
        if (!currentUser) return;
        currentUser.watched = currentUser.watched || [];
        currentUser.watchlist = currentUser.watchlist || [];

        watchedBtn.classList.toggle('active', currentUser.watched.includes(movieId));
        
        const inWatchlist = currentUser.watchlist.includes(movieId);
        watchlistBtn.classList.toggle('active', inWatchlist);
        watchlistIcon.className = inWatchlist ? 'fas fa-check-circle' : 'fas fa-plus-circle';
        watchlistText.textContent = inWatchlist ? 'Para Assistir' : 'Para Assistir';
    }

    function toggleListItem(listType) {
        if (!currentUser) return;
        const list = currentUser[listType] || [];
        const isMovieInList = list.includes(movieId);

        if (isMovieInList) {
            list.splice(list.indexOf(movieId), 1);
        } else {
            list.push(movieId);
            const oppositeListType = listType === 'watched' ? 'watchlist' : 'watched';
            const oppositeList = currentUser[oppositeListType] || [];
            if (oppositeList.includes(movieId)) {
                oppositeList.splice(oppositeList.indexOf(movieId), 1);
            }
        }
        
        allUsersData[activeUserEmail] = currentUser;
        localStorage.setItem('reviewFlixAllUsers', JSON.stringify(allUsersData));
        updateButtonsState();
    }


    function handleReviewActions(event) {
        const reviewItem = event.target.closest('.user-review-item');
        if (!reviewItem) return;

        const likeBtn = event.target.closest('.like-btn');
        const dislikeBtn = event.target.closest('.dislike-btn');
        
        if (likeBtn || dislikeBtn) {
            if (!currentUser) {
                alert("Você precisa estar logado para avaliar um comentário.");
                return;
            }
            const reviewId = reviewItem.dataset.reviewId;
            const review = (movieReviews[movieId] || []).find(r => r.reviewId === reviewId);
            if (!review) return;

            const userEmail = currentUser.email;
            review.likedBy = review.likedBy || [];
            review.dislikedBy = review.dislikedBy || [];
            
            if (likeBtn) {
                const likeIndex = review.likedBy.indexOf(userEmail);
                if (likeIndex > -1) {
                    review.likedBy.splice(likeIndex, 1);
                } else {
                    review.likedBy.push(userEmail);
                    const dislikeIndex = review.dislikedBy.indexOf(userEmail);
                    if (dislikeIndex > -1) review.dislikedBy.splice(dislikeIndex, 1);
                }
            } else if (dislikeBtn) {
                const dislikeIndex = review.dislikedBy.indexOf(userEmail);
                if (dislikeIndex > -1) {
                    review.dislikedBy.splice(dislikeIndex, 1);
                } else {
                    review.dislikedBy.push(userEmail);
                    const likeIndex = review.likedBy.indexOf(userEmail);
                    if (likeIndex > -1) review.likedBy.splice(likeIndex, 1);
                }
            }

            const userReviewToUpdate = (currentUser.reviews || []).find(r => r.reviewId === reviewId);
            if (userReviewToUpdate) {
                userReviewToUpdate.likedBy = review.likedBy;
                userReviewToUpdate.dislikedBy = review.dislikedBy;
            }
            allUsersData[activeUserEmail] = currentUser;
            localStorage.setItem('reviewFlixAllUsers', JSON.stringify(allUsersData));

            localStorage.setItem('reviewFlixMovieReviews', JSON.stringify(movieReviews));
            updateReviewUIDOM(reviewItem, review);
            return;
        }

        handleMenuActions(event, reviewItem);
    }

    function updateReviewUIDOM(reviewElement, reviewData) {
        const likeBtn = reviewElement.querySelector('.like-btn');
        const dislikeBtn = reviewElement.querySelector('.dislike-btn');
        
        likeBtn.querySelector('span').textContent = reviewData.likedBy.length;
        dislikeBtn.querySelector('span').textContent = reviewData.dislikedBy.length;

        if (currentUser) {
            likeBtn.classList.toggle('active', reviewData.likedBy.includes(currentUser.email));
            dislikeBtn.classList.toggle('active', reviewData.dislikedBy.includes(currentUser.email));
        }
    }

    function handleMenuActions(event, reviewItem) {
        if (!currentUser) return;
        const reviewId = reviewItem.dataset.reviewId;
        const review = (movieReviews[movieId] || []).find(r => r.reviewId === reviewId);
        if (!review || review.userEmail !== currentUser.email) return;

        const optionsBtn = event.target.closest('.options-btn');
        if (optionsBtn) {
            optionsBtn.nextElementSibling.classList.toggle('active');
        } else if (event.target.closest('.edit-review-btn')) {
            enterEditMode(review);
        } else if (event.target.closest('.delete-review-btn')) {
            if (confirm("Tem certeza que deseja remover sua avaliação?")) {
                movieReviews[movieId] = movieReviews[movieId].filter(r => r.reviewId !== reviewId);
                currentUser.reviews = currentUser.reviews.filter(r => r.reviewId !== reviewId);
                localStorage.setItem('reviewFlixMovieReviews', JSON.stringify(movieReviews));
                localStorage.setItem('reviewFlixAllUsers', JSON.stringify(allUsersData));
                loadAndRenderReviews();
            }
        }
    }
    
    function hasUserReviewed() {
        const reviewsForThisMovie = movieReviews[movieId] || [];
        return reviewsForThisMovie.some(review => review.userEmail === activeUserEmail);
    }
    function lockReviewForm() {
        reviewForm.querySelector('input').disabled = true;
        reviewForm.querySelector('textarea').disabled = true;
        reviewFormSubmitBtn.disabled = true;
        reviewFormSubmitBtn.textContent = 'Sua avaliação já foi postada';
    }
    function unlockReviewForm() {
        reviewForm.querySelector('input').disabled = false;
        reviewForm.querySelector('textarea').disabled = false;
        reviewFormSubmitBtn.disabled = false;
        reviewFormSubmitBtn.textContent = 'Postar Avaliação';
        reviewForm.reset();
    }
    function enterEditMode(review) {
        isEditMode = true;
        reviewBeingEditedId = review.reviewId;
        reviewFormSection.classList.add('editing-review');
        reviewFormTitle.textContent = "Editando sua Avaliação";
        document.getElementById('user-score-input').value = review.score;
        document.getElementById('user-comment-input').value = review.comment;
        reviewFormSubmitBtn.textContent = 'Salvar Alterações';
        reviewFormSubmitBtn.disabled = false;
        if (!document.getElementById('cancelEditBtn')) {
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.id = 'cancelEditBtn';
            cancelBtn.className = 'btn-cancel-edit';
            cancelBtn.textContent = 'Cancelar Edição';
            cancelBtn.addEventListener('click', cancelEditMode);
            formButtonsContainer.appendChild(cancelBtn);
        }
        reviewForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    function cancelEditMode() {
        isEditMode = false;
        reviewBeingEditedId = null;
        reviewFormSection.classList.remove('editing-review');
        reviewFormTitle.textContent = "Deixe sua Avaliação";
        reviewForm.reset();
        const cancelBtn = document.getElementById('cancelEditBtn');
        if (cancelBtn) cancelBtn.remove();
        if (hasUserReviewed()) lockReviewForm();
        else unlockReviewForm();
    }
    
    function loadAndRenderReviews() {
        reviewsListContainer.innerHTML = '';
        const reviewsForThisMovie = movieReviews[movieId] || [];
        if (reviewsForThisMovie.length === 0) {
            reviewsListContainer.innerHTML = `<p class="no-reviews-message">Ainda não há avaliações para este filme. Seja o primeiro a avaliar!</p>`;
        } else {
            reviewsForThisMovie.forEach(review => {
                reviewsListContainer.appendChild(createReviewElement(review));
            });
        }
        if (currentUser && hasUserReviewed() && !isEditMode) lockReviewForm();
        else if (currentUser) unlockReviewForm();
    }

    function handleReviewSubmit(event) {
        event.preventDefault();
        const scoreInput = document.getElementById('user-score-input');
        const commentInput = document.getElementById('user-comment-input');
        if (isEditMode) {
            const reviewInGeneral = movieReviews[movieId].find(r => r.reviewId === reviewBeingEditedId);
            const reviewInUser = currentUser.reviews.find(r => r.reviewId === reviewBeingEditedId);
            const newScore = parseFloat(scoreInput.value).toFixed(1);
            const newComment = commentInput.value;
            if (reviewInGeneral) {
                reviewInGeneral.score = newScore;
                reviewInGeneral.comment = newComment;
            }
            if(reviewInUser) {
                reviewInUser.score = newScore;
                reviewInUser.comment = newComment;
            }
            cancelEditMode();
        } else {
            if (hasUserReviewed()) {
                alert("Você já avaliou este filme.");
                return;
            }
            const reviewData = {
                reviewId: `review-${Date.now()}`, userEmail: activeUserEmail, userName: currentUser.fullName,
                userProfilePic: currentUser.profilePic || 'https://i.pravatar.cc/40',
                score: parseFloat(scoreInput.value).toFixed(1), comment: commentInput.value,
                likes: 0, dislikes: 0, likedBy: [], dislikedBy: []
            };
            if (!movieReviews[movieId]) movieReviews[movieId] = [];
            movieReviews[movieId].unshift(reviewData);
            currentUser.reviews = currentUser.reviews || [];
            currentUser.reviews.unshift({ movieId: movieId, movieTitle: movieTitle, ...reviewData });
        }
        localStorage.setItem('reviewFlixMovieReviews', JSON.stringify(movieReviews));
        localStorage.setItem('reviewFlixAllUsers', JSON.stringify(allUsersData));
        loadAndRenderReviews();
    }

    function createReviewElement(review) {
        const div = document.createElement('div');
        div.className = 'user-review-item';
        div.setAttribute('data-review-id', review.reviewId);
        const ratingClass = review.score >= 8 ? 'rating-high' : review.score >= 6 ? 'rating-medium' : 'rating-low';
        review.likedBy = review.likedBy || [];
        review.dislikedBy = review.dislikedBy || [];
        let optionsMenuHTML = '';
        if (currentUser && review.userEmail === currentUser.email) {
            optionsMenuHTML = `
                <div class="review-options-container">
                    <button class="options-btn" aria-label="Opções da avaliação"><i class="fas fa-ellipsis-v"></i></button>
                    <div class="options-menu">
                        <button class="menu-option edit-review-btn">Editar avaliação</button>
                        <button class="menu-option delete-review-btn">Remover avaliação</button>
                    </div>
                </div>`;
        }
        const likeBtnClass = currentUser && review.likedBy.includes(currentUser.email) ? "like-btn active" : "like-btn";
        const dislikeBtnClass = currentUser && review.dislikedBy.includes(currentUser.email) ? "dislike-btn active" : "dislike-btn";
        div.innerHTML = `
            ${optionsMenuHTML}
            <div class="review-author"><img src="${review.userProfilePic || 'https://i.pravatar.cc/40'}" alt="Foto de ${review.userName}"><span>${review.userName}</span></div>
            <div class="user-rating-container"><div class="rating-score-box ${ratingClass}"><span>${review.score}</span></div><span class="rating-max">/ 10</span></div>
            <p>${review.comment}</p>
            <div class="feedback-actions">
                <button class="${likeBtnClass}"><i class="fas fa-thumbs-up"></i> <span>${review.likedBy.length}</span></button>
                <button class="${dislikeBtnClass}"><i class="fas fa-thumbs-down"></i> <span>${review.dislikedBy.length}</span></button>
            </div>`;
        return div;
    }
    
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.review-options-container')) {
            document.querySelectorAll('.options-menu.active').forEach(menu => menu.classList.remove('active'));
        }
    });

    initializePage();
});