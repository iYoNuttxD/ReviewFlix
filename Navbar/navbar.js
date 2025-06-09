document.addEventListener('DOMContentLoaded', function () {
    const navProfileLink = document.getElementById('nav-profile-link');
    const navProfilePic = document.getElementById('nav-profile-pic');
    const navProfileName = document.getElementById('nav-profile-name');

    const activeUserEmail = localStorage.getItem('reviewFlixActiveUserEmail');

    const profilePagePath = "Pagina de Perfil/Perfil/Perfil.html";
    const loginPagePath = "Pagina de Perfil/Login/Login.html";

    if (activeUserEmail && navProfileLink) {
        const allUsersData = JSON.parse(localStorage.getItem('reviewFlixAllUsers')) || {};
        const currentUser = allUsersData[activeUserEmail];

        if (currentUser) {
            navProfileLink.href = profilePagePath;

            if (currentUser.profilePic && currentUser.profilePic.startsWith('data:image')) {
                navProfilePic.src = currentUser.profilePic;
            } else {
                navProfilePic.src = 'https://placehold.co/40x40?text=P';
            }
            
            const firstName = currentUser.fullName.split(' ')[0];
            navProfileName.textContent = firstName;
        }

    } else if(navProfileLink) {
        navProfileLink.href = loginPagePath;
        
    }
});
