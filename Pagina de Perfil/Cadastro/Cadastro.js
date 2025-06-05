document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const birthDateInput = document.getElementById('birthDate');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitButton = document.getElementById('submitButton');

    const strengthIndicator = document.getElementById('passwordStrength');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const passwordMatchMessage = document.getElementById('passwordMatchMessage');

    const profilePicInput = document.getElementById('profilePic');
    const profilePicPreview = document.getElementById('profilePicPreview');
    let profilePicBase64 = '';

    profilePicInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            profilePicPreview.innerHTML = ''; 
            const img = document.createElement('img');
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '50%';
            
            reader.onload = function(e) {
                img.src = e.target.result;
                profilePicBase64 = e.target.result;
                profilePicPreview.appendChild(img);
            }
            reader.readAsDataURL(file);
        } else {
            profilePicPreview.innerHTML = '<span>+</span>'; 
            profilePicBase64 = '';
        }
    });

    function checkPasswordStrength(password) {
        let level = 'baixo';
        let levelClass = 'strength-baixo';
        let text = 'Força da senha: Baixa';

        if (password.length === 0) {
            return { level: '', text: 'Força da senha:', class: '' };
        }

        const hasLength = password.length >= 8;
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[\W_]/.test(password);

        let typesCount = 0;
        if (hasLower) typesCount++;
        if (hasUpper) typesCount++;
        if (hasNumber) typesCount++;
        if (hasSymbol) typesCount++;

        if (hasLength) {
            // PARA FORÇA ALTA: Exigir comprimento, pelo menos 3 tipos E que um deles seja um símbolo.
            if (typesCount >= 3 && hasSymbol) { 
                level = 'alto';
                levelClass = 'strength-alto';
                text = 'Força da senha: Alta';
            } 
            // PARA FORÇA MÉDIA: Comprimento E (pelo menos 2 tipos OU (3 tipos mas sem símbolo))
            else if (typesCount >= 2) { 
                level = 'medio';
                levelClass = 'strength-medio';
                text = 'Força da senha: Média';
            }
        }
        if (password.length > 0 && password.length < 8) {
            text = 'Força da senha: Baixa (muito curta)';
            level = 'baixo';
            levelClass = 'strength-baixo';
        }
        
        return { level, text, class: levelClass };
    }

    function updatePasswordStrengthUI() {
        const password = passwordInput.value;
        const strengthData = checkPasswordStrength(password);
        strengthIndicator.className = 'password-strength-indicator ' + strengthData.class;
        strengthText.textContent = strengthData.text;
        if (password.length === 0) {
            strengthBar.style.width = '0%';
        } else {
            strengthBar.style.width = ''; // Permite que o CSS controle a largura
        }
        validateForm();
    }

    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        if (!confirmPassword && !password) {
            passwordMatchMessage.textContent = '';
            passwordMatchMessage.className = 'password-match-message';
            validateForm(); return;
        }
        if (!confirmPassword) {
             passwordMatchMessage.textContent = '';
             passwordMatchMessage.className = 'password-match-message';
             validateForm(); return;
        }
        if (password === confirmPassword) {
            passwordMatchMessage.textContent = 'As senhas conferem.';
            passwordMatchMessage.className = 'password-match-message match';
        } else {
            passwordMatchMessage.textContent = 'As senhas não conferem.';
            passwordMatchMessage.className = 'password-match-message no-match';
        }
        validateForm();
    }

    function validateForm() {
        const isFullNameValid = fullNameInput.value.trim() !== '';
        const isEmailValid = emailInput.value.trim() !== '' && emailInput.checkValidity();
        const isBirthDateValid = birthDateInput.value !== '';
        const passwordStrengthData = checkPasswordStrength(passwordInput.value);
        const isPasswordStrongEnough = passwordStrengthData.level === 'medio' || passwordStrengthData.level === 'alto';
        const doPasswordsMatch = passwordInput.value === confirmPasswordInput.value && passwordInput.value.length > 0;
        submitButton.disabled = !(isFullNameValid && isEmailValid && isBirthDateValid && isPasswordStrongEnough && doPasswordsMatch);
    }

    passwordInput.addEventListener('input', updatePasswordStrengthUI);
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    [fullNameInput, emailInput, birthDateInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('input', validateForm);
    });
    
    updatePasswordStrengthUI();
    checkPasswordMatch();
    validateForm();

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault(); 
        if (submitButton.disabled) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const newEmail = emailInput.value.trim();
        const allUsersData = JSON.parse(localStorage.getItem('reviewFlixAllUsers')) || {};

        if (allUsersData[newEmail]) {
            alert('Este email já está cadastrado. Tente fazer login.');
            return;
        }

        const userData = {
            profilePic: profilePicBase64,
            fullName: fullNameInput.value.trim(),
            email: newEmail,
            birthDate: birthDateInput.value,
            password: passwordInput.value
        };

        allUsersData[newEmail] = userData; // Adiciona novo usuário ao objeto de usuários
        localStorage.setItem('reviewFlixAllUsers', JSON.stringify(allUsersData));
        localStorage.setItem('reviewFlixActiveUserEmail', newEmail); // Define usuário atual como logado

        alert('Cadastro realizado com sucesso! Redirecionando para o perfil...');
        window.location.href = '../Perfil/Perfil.html';
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