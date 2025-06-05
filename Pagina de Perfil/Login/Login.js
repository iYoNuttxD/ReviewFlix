document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const enteredEmail = emailInput.value.trim();
        const enteredPassword = passwordInput.value;

        if (!enteredEmail || !enteredPassword) {
            alert('Por favor, preencha o email e a senha.');
            return;
        }

        const allUsersData = JSON.parse(localStorage.getItem('reviewFlixAllUsers')) || {};
        const storedUser = allUsersData[enteredEmail];

        if (storedUser) {
            if (enteredPassword === storedUser.password) {
                localStorage.setItem('reviewFlixActiveUserEmail', storedUser.email);
                alert('Login realizado com sucesso! Redirecionando para o perfil...');
                window.location.href = '../Perfil/Perfil.html';
            } else {
                alert('Senha incorreta. Tente novamente.');
            }
        } else {
            alert('Email não cadastrado. Por favor, realize o cadastro primeiro.');
        }
    });
});

function togglePasswordVisibility(inputId, iconElement) {
    const passwordField = document.getElementById(inputId);
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        iconElement.textContent = '🙈'; 
    } else {
        passwordField.type = 'password';
        iconElement.textContent = '👁️'; 
    }
}