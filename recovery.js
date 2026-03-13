// Variables globales
let currentStep = 1;
let recoveryToken = null;
let verificationToken = null;

// Fonction: Envoyer le code de vérification
function sendVerificationCode() {
    const email = document.getElementById('email').value;
    
    if (!email) {
        showError('Veuillez entrer votre adresse email');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Adresse email invalide');
        return;
    }
    
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = 'Envoi en cours...';
    
    fetch('recovery_handler.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'action=send_code&email=' + encodeURIComponent(email)
    })
    .then(response => response.json())
    .then(data => {
        btn.disabled = false;
        btn.textContent = 'Envoyer le code';
        
        if (data.success) {
            recoveryToken = data.token;
            showSuccess('Code envoyé! Vérifiez votre email.');
            goToStep(2);
        } else {
            showError(data.message || 'Erreur lors de l\'envoi du code');
        }
    })
    .catch(error => {
        btn.disabled = false;
        btn.textContent = 'Envoyer le code';
        showError('Erreur de connexion: ' + error.message);
    });
}

// Fonction: Vérifier le code
function verifyCode() {
    const code = document.getElementById('verification-code').value;
    
    if (!code || code.length !== 6) {
        showError('Veuillez entrer un code valide (6 caractères)');
        return;
    }
    
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = 'Vérification...';
    
    fetch('recovery_handler.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'action=verify_code&token=' + encodeURIComponent(recoveryToken) + 
              '&code=' + encodeURIComponent(code)
    })
    .then(response => response.json())
    .then(data => {
        btn.disabled = false;
        btn.textContent = 'Vérifier le code';
        
        if (data.success) {
            verificationToken = data.verification_token;
            showSuccess('Code vérifié! Créez un nouveau mot de passe.');
            goToStep(3);
        } else {
            showError(data.message || 'Code invalide ou expiré');
        }
    })
    .catch(error => {
        btn.disabled = false;
        btn.textContent = 'Vérifier le code';
        showError('Erreur: ' + error.message);
    });
}

// Fonction: Réinitialiser le mot de passe
function resetPassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!newPassword || !confirmPassword) {
        showError('Veuillez remplir tous les champs');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showError('Les mots de passe ne correspondent pas');
        return;
    }
    
    if (!isStrongPassword(newPassword)) {
        showError('Le mot de passe doit contenir au moins 8 caractères, incluant majuscules, minuscules et chiffres');
        return;
    }
    
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = 'Réinitialisation...';
    
    fetch('recovery_handler.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'action=reset_password&verification_token=' + encodeURIComponent(verificationToken) + 
              '&password=' + encodeURIComponent(newPassword)
    })
    .then(response => response.json())
    .then(data => {
        btn.disabled = false;
        btn.textContent = 'Réinitialiser le mot de passe';
        
        if (data.success) {
            goToStep('success');
        } else {
            showError(data.message || 'Erreur lors de la réinitialisation');
        }
    })
    .catch(error => {
        btn.disabled = false;
        btn.textContent = 'Réinitialiser le mot de passe';
        showError('Erreur: ' + error.message);
    });
}

// Navigation entre étapes
function goToStep(step) {
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.add('hidden');
    });
    
    if (step === 'success') {
        document.getElementById('step-success').classList.remove('hidden');
    } else {
        document.getElementById('step-' + step).classList.remove('hidden');
    }
    
    currentStep = step;
}

// Retour à étape précédente
function backToStep(step) {
    hideError();
    hideSuccess();
    goToStep(step);
    
    if (step === 1) {
        document.getElementById('verification-code').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        document.getElementById('strength-fill').style.width = '0%';
    }
}

// Vérifier la force du mot de passe
function checkPasswordStrength() {
    const password = document.getElementById('new-password').value;
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');
    
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    
    strengthFill.style.width = strength + '%';
    
    if (strength < 50) {
        strengthText.textContent = 'Faible';
        strengthText.style.color = '#dc3545';
    } else if (strength < 75) {
        strengthText.textContent = 'Moyen';
        strengthText.style.color = '#ffc107';
    } else {
        strengthText.textContent = 'Fort';
        strengthText.style.color = '#28a745';
    }
}

// Validation email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Vérifier la force du mot de passe
function isStrongPassword(password) {
    return password.length >= 8 && 
           /[a-z]/.test(password) && 
           /[A-Z]/.test(password) && 
           /[0-9]/.test(password);
}

// Messages d'erreur/succès
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    document.getElementById('success-message').classList.add('hidden');
}

function hideError() {
    document.getElementById('error-message').classList.add('hidden');
}

function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    successDiv.textContent = message;
    successDiv.classList.remove('hidden');
    document.getElementById('error-message').classList.add('hidden');
}

function hideSuccess() {
    document.getElementById('success-message').classList.add('hidden');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('new-password');
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }
});