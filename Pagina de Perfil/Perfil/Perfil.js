// Perfil.js
document.addEventListener('DOMContentLoaded', function () {
    // Verifica o status de login primeiro
    const activeUserEmail = localStorage.getItem('reviewFlixActiveUserEmail');

    if (!activeUserEmail) {
        // Se não estiver logado, usa alert e redireciona
        alert('Você não está logado. Redirecionando para a página de login.');
        window.location.href = '/Login/Login.html';
        return; // Para a execução do script se não estiver logado
    }

    // Se estiver logado, prossegue com a configuração da página de perfil
    const allUsersData = JSON.parse(localStorage.getItem('reviewFlixAllUsers')) || {};
    let currentUser = allUsersData[activeUserEmail];

    // Segurança extra: se o email ativo não tiver dados correspondentes
    if (!currentUser) {
        alert('Erro ao carregar dados do usuário. Redirecionando para login.');
        localStorage.removeItem('reviewFlixActiveUserEmail');
        window.location.href = '/Login/Login.html';
        return;
    }

    // Elementos do formulário de informações do usuário
    const editInfoBtn = document.getElementById('editInfoBtn');
    const saveInfoBtn = document.getElementById('saveInfoBtn');
    const userInfoForm = document.getElementById('userInfoForm');
    
    const fullNameField = document.getElementById('fullName');
    const birthDateField = document.getElementById('birthDate');
    const emailField = document.getElementById('email');
    const profilePicImg = document.getElementById('profilePicImg');
    
    // Inputs que podem ser editados (todos exceto email)
    const formInputsForEditing = userInfoForm ? userInfoForm.querySelectorAll('input:not(#email)') : []; 

    // Elementos para upload da foto de perfil
    const profilePicUpload = document.getElementById('profilePicUpload');
    const changePicBtn = document.getElementById('changePicBtn');
    
    // Botão de Logout
    const logoutBtn = document.getElementById('logoutBtn'); 
    
    // Variável para armazenar a nova foto de perfil em Base64 antes de salvar
    let newProfilePicBase64 = currentUser.profilePic || ''; 

    // Função para carregar os dados do usuário nos campos da página
    function loadUserProfileData() {
        if(fullNameField) fullNameField.value = currentUser.fullName || '';
        if(emailField) emailField.value = currentUser.email || ''; 
        if(birthDateField) birthDateField.value = currentUser.birthDate || '';
        
        if (profilePicImg && currentUser.profilePic && currentUser.profilePic.startsWith('data:image')) {
            profilePicImg.src = currentUser.profilePic;
        } else if (profilePicImg) {
            // Se não houver foto no localStorage ou não for base64, usa o placeholder
            profilePicImg.src = 'https://placehold.co/150x150?text=Foto'; 
        }
    }

    // Carrega os dados do perfil do usuário ao iniciar a página
    loadUserProfileData(); 

    // Event listener para o botão "Editar Dados"
    if (editInfoBtn) {
        editInfoBtn.addEventListener('click', function () {
            if(formInputsForEditing.length > 0) {
                formInputsForEditing.forEach(input => input.disabled = false);
            }
            editInfoBtn.style.display = 'none';
            if(saveInfoBtn) saveInfoBtn.style.display = 'inline-block';
        });
    }

    // Event listener para o formulário "Salvar Alterações"
    if (userInfoForm && saveInfoBtn) {
        userInfoForm.addEventListener('submit', function (event) {
            event.preventDefault(); 
            
            // Atualiza o objeto currentUser com os novos valores
            currentUser.fullName = fullNameField.value;
            currentUser.birthDate = birthDateField.value;
            
            // Atualiza a foto de perfil no objeto 'currentUser' se uma nova foi carregada
            if (newProfilePicBase64 && newProfilePicBase64.startsWith('data:image')) {
                currentUser.profilePic = newProfilePicBase64;
            }

            // Atualiza este usuário dentro do objeto allUsersData
            allUsersData[activeUserEmail] = currentUser;
            // Salva o objeto allUsersData (contendo todos os usuários) atualizado de volta no localStorage
            localStorage.setItem('reviewFlixAllUsers', JSON.stringify(allUsersData)); 
            
            if(formInputsForEditing.length > 0) {
                formInputsForEditing.forEach(input => input.disabled = true);
            }
            saveInfoBtn.style.display = 'none';
            if(editInfoBtn) editInfoBtn.style.display = 'inline-block';
            
            alert('Informações atualizadas e salvas localmente!');
        });
    }

    // Event listener para o botão "Alterar Foto" e input de arquivo
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
                    newProfilePicBase64 = e.target.result; // Armazena a nova foto em base64 para ser salva ao submeter o formulário
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Lógica para o botão de Deslogar
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('reviewFlixActiveUserEmail'); 

            alert('Você foi deslogado. Redirecionando...');
            window.location.href = '/Login/Login.html';
        });
    }

    // Lógica para os menus de opções ("três pontinhos") dos filmes
    const allOptionsBtns = document.querySelectorAll('.options-btn');

    allOptionsBtns.forEach(btn => {
        btn.addEventListener('click', function (event) {
            event.stopPropagation(); // Impede que o clique se propague e feche o menu imediatamente
            
            const currentMenu = this.nextElementSibling;
            
            // Fecha todos os outros menus que possam estar abertos
            closeAllOptionMenus(currentMenu); 
            
            // Alterna o menu específico deste botão
            if (currentMenu && currentMenu.classList.contains('options-menu')) {
                currentMenu.classList.toggle('active');
            }
        });
    });

    // Função para fechar todos os menus de opções, exceto o especificado
    function closeAllOptionMenus(exceptThisMenu) {
        document.querySelectorAll('.options-menu.active').forEach(menu => {
            if (menu !== exceptThisMenu) {
                menu.classList.remove('active');
            }
        });
    }

    // Fecha os menus se clicar em qualquer lugar fora deles
    document.addEventListener('click', function (event) {
        // Se o clique não foi em um botão de opções nem dentro de um menu aberto
        if (!event.target.closest('.options-btn') && !event.target.closest('.options-menu.active')) {
            closeAllOptionMenus(null); // Fecha todos os menus
        }
    });
});