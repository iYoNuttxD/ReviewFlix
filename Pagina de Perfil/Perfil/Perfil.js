// Perfil.js
document.addEventListener('DOMContentLoaded', function () {
    // Verifica o status de login primeiro
    const activeUserEmail = localStorage.getItem('reviewFlixActiveUserEmail');

    if (!activeUserEmail) {
        alert('Você não está logado. Redirecionando para a página de login.');
        window.location.href = 'Login.html'; // Caminho relativo
        return; 
    }

    const allUsersData = JSON.parse(localStorage.getItem('reviewFlixAllUsers')) || {};
    let currentUser = allUsersData[activeUserEmail];

    if (!currentUser) {
        alert('Erro ao carregar dados do usuário. Redirecionando para login.');
        localStorage.removeItem('reviewFlixActiveUserEmail');
        window.location.href = 'Login.html'; // Caminho relativo
        return;
    }

    // Elementos do DOM
    const editInfoBtn = document.getElementById('editInfoBtn');
    const saveInfoBtn = document.getElementById('saveInfoBtn');
    const userInfoForm = document.getElementById('userInfoForm');
    const fullNameField = document.getElementById('fullName');
    const birthDateField = document.getElementById('birthDate');
    const emailField = document.getElementById('email');
    const profilePicImg = document.getElementById('profilePicImg');
    const formInputsForEditing = userInfoForm ? userInfoForm.querySelectorAll('input:not(#email)') : [];
    const profilePicUpload = document.getElementById('profilePicUpload');
    const changePicBtn = document.getElementById('changePicBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    let newProfilePicBase64 = currentUser.profilePic || '';

    function loadUserProfileData() {
        if(fullNameField) fullNameField.value = currentUser.fullName || '';
        if(emailField) emailField.value = currentUser.email || ''; 
        if(birthDateField) birthDateField.value = currentUser.birthDate || '';
        
        if (profilePicImg && currentUser.profilePic && currentUser.profilePic.startsWith('data:image')) {
            profilePicImg.src = currentUser.profilePic;
        } else if (profilePicImg) {
            profilePicImg.src = 'https://placehold.co/150x150?text=Foto'; 
        }
    }

    loadUserProfileData(); 

    if (editInfoBtn && saveInfoBtn && userInfoForm && formInputsForEditing.length > 0) {
        editInfoBtn.addEventListener('click', function () {
            formInputsForEditing.forEach(input => input.disabled = false);
            editInfoBtn.style.display = 'none';
            saveInfoBtn.style.display = 'inline-block';
        });

        userInfoForm.addEventListener('submit', function (event) {
            event.preventDefault(); 
            
            currentUser.fullName = fullNameField.value;
            currentUser.birthDate = birthDateField.value;
            
            if (newProfilePicBase64 && newProfilePicBase64.startsWith('data:image')) {
                currentUser.profilePic = newProfilePicBase64;
            }

            allUsersData[activeUserEmail] = currentUser;
            localStorage.setItem('reviewFlixAllUsers', JSON.stringify(allUsersData)); 
            
            formInputsForEditing.forEach(input => input.disabled = true);
            saveInfoBtn.style.display = 'none';
            editInfoBtn.style.display = 'inline-block';
            
            alert('Informações atualizadas e salvas localmente!');
        });
    }

    if(changePicBtn && profilePicUpload) {
        changePicBtn.addEventListener('click', function() {
            profilePicUpload.click(); 
        });

        profilePicUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if(profilePicImg) profilePicImg.src = e.target.result;
                    newProfilePicBase64 = e.target.result; 
                }
                reader.readAsDataURL(file);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('reviewFlixActiveUserEmail'); 
            alert('Você foi deslogado. Redirecionando...');
            window.location.href = 'Login.html'; // Caminho relativo
        });
    }

    // Lógica para os menus de opções ("três pontinhos")
    const allOptionsBtns = document.querySelectorAll('.options-btn');

    allOptionsBtns.forEach(btn => {
        btn.addEventListener('click', function (event) {
            event.stopPropagation(); 
            const currentMenu = this.nextElementSibling; 
            closeAllOptionMenus(currentMenu); 
            if (currentMenu && currentMenu.classList.contains('options-menu')) {
                currentMenu.classList.toggle('active');
            }
        });
    });

    function closeAllOptionMenus(exceptThisMenu) {
        document.querySelectorAll('.options-menu.active').forEach(menu => {
            if (menu !== exceptThisMenu) {
                menu.classList.remove('active');
            }
        });
    }

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.options-btn') && !event.target.closest('.options-menu.active')) {
            closeAllOptionMenus(null); 
        }
    });

    // Lógica para rolagem horizontal das listas de filmes
    function setupHorizontalScroll(listId, prevBtnId, nextBtnId) {
        const moviesList = document.getElementById(listId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);

        if (!moviesList || !prevBtn || !nextBtn) {
            return;
        }

        function updateScrollButtonsState() {
            if (!moviesList.offsetParent) return; // Não atualiza se a lista não estiver visível (pode acontecer em abas, etc.)
            const scrollLeft = moviesList.scrollLeft;
            const maxScrollLeft = moviesList.scrollWidth - moviesList.clientWidth;
            
            prevBtn.classList.toggle('hidden', scrollLeft <= 1);
            nextBtn.classList.toggle('hidden', scrollLeft >= maxScrollLeft - 1);
        }

        prevBtn.addEventListener('click', () => {
            const itemWidth = moviesList.querySelector('.movie-list-item')?.offsetWidth || 120;
            const gap = 15; 
            moviesList.scrollLeft -= (itemWidth + gap) * 2; // Rola por aprox. 2 itens
        });

        nextBtn.addEventListener('click', () => {
            const itemWidth = moviesList.querySelector('.movie-list-item')?.offsetWidth || 120;
            const gap = 15;
            moviesList.scrollLeft += (itemWidth + gap) * 2; // Rola por aprox. 2 itens
        });

        moviesList.addEventListener('scroll', updateScrollButtonsState);
        
        // Um pequeno timeout para garantir que o layout foi calculado antes do primeiro update dos botões
        setTimeout(updateScrollButtonsState, 100); 
        window.addEventListener('resize', updateScrollButtonsState);
    }

    setupHorizontalScroll('watchedMoviesList', 'watchedPrevBtn', 'watchedNextBtn');
    setupHorizontalScroll('watchlistMoviesList', 'watchlistPrevBtn', 'watchlistNextBtn');
});