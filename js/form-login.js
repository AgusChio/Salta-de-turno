const $ = (selector) => document.querySelector(selector);
const addClass = (selector, clas) => $(selector).classList.add(clas);
const removeClass = (selector, clas) => $(selector).classList.remove(clas);

const formLogin = $(".container-form-login");
const signupLoginLink = formLogin.querySelectorAll(".btn-title");

signupLoginLink.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        if (link.getAttribute("data-form") === "login"){
            removeClass(".login", "none");
            addClass(".signup", "none");
            link.classList.remove("btn-title-off");
            addClass(".title-signup", "btn-title-off");
        } else {
            removeClass(".signup", "none");
            addClass(".login", "none");
            link.classList.remove("btn-title-off");
            addClass(".title-login", "btn-title-off");
        }
    });
});

function togglePasswordVisibility(passwordFieldId) {
    var passwordInput = document.getElementById(passwordFieldId);
    var passwordIcon = passwordInput.nextElementSibling;

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.setAttribute('data-icon', 'mdi:eye-off');
    } else {
        passwordInput.type = 'password';
        passwordIcon.setAttribute('data-icon', 'mdi:eye');
    }
}

// Validaciones
const validateEmail = (email) => {
    if (email.trim() === "") return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
};


const validateEmpty = (value) => value != "";
const validatePassword = (password) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(password);

const checkField = (id, errorClass, validationFunc, emptyCheck = false) => {
    const value = $(id).value;
    let isValid = validationFunc(value);
    if (emptyCheck && value === "") {
        isValid = false;
    }

    if (!isValid) {
        removeClass(errorClass, "none");
        addClass(id, "invalid");
    } else {
        addClass(errorClass, "none");
        removeClass(id, "invalid");
    }
};

const checkPasswordsMatch = () => {
    const password = $("#password-signup").value;
    const confirmPassword = $("#confirm-password").value;
    if (password !== confirmPassword) {
        removeClass(".password-match-error", "none");
        addClass("#confirm-password", "invalid");
    } else {
        addClass(".password-match-error", "none");
        removeClass("#confirm-password", "invalid");
    }
};

$("#form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    checkField("#name", ".name-error", validateEmpty, true);
    checkField("#email-login", ".email-error", validateEmail);

    if (Array.from($(".container-form-login .invalid")).length === 0) {
        const email = $("#email-login").value;
        const password = $("#password").value;

        try {
            const response = await fetch('https://api-salta-de-turno.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Error en el login');
            }

            const data = await response.json();
            Swal.fire({
                title: 'Inicio de Sesión Exitoso',
                text: 'Bienvenido a Salta de Turno!',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then(() => {
                window.location.href = '/index.html'; // Reemplaza con tu URL de destino
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al iniciar sesión. Por favor, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }
});

$("#form-signup").addEventListener("submit", async (e) => {
    e.preventDefault();
    checkField("#email-login", ".email-error", validateEmail);
    checkField("#password", ".password-error", validatePassword);
    checkField("#confirm-password", ".password-match-error", validatePassword);
    checkPasswordsMatch();

    if (Array.from($(".container-form-login .invalid")).length === 0) {
        const name = $("#name").value;
        const email = $("#email-signup").value;
        const password = $("#password-signup").value;
        const status = true;
        const google = false;
        const apiKey = "";
        const rol = "user";
        const modoOscuro = false;
        const terminosYCondiciones = $('#acept').checked;

        try {
            const response = await fetch('https://api-salta-de-turno.onrender.com/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, email, password, status, google, apiKey, rol, modoOscuro, terminosYCondiciones })
            });

            if (!response.ok) {
                throw new Error('Error en el registro');
            }

            const data = await response.json();
            Swal.fire({
                title: 'Registro Exitoso',
                text: '¡Tu cuenta ha sido creada exitosamente!',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then(() => {
                window.location.href = '/index.html';
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al registrarse. Por favor, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }
});

$("#name").addEventListener("keyup", () => checkField("#name", ".name-error", validateEmpty, true));
$("#email-login").addEventListener("keyup", () => checkField("#email-login", ".email-error", validateEmail, true));
$("#password-signup").addEventListener("keyup", () => checkField("#password-signup", ".password-error", validatePassword));
$("#email-signup").addEventListener("keyup", () => checkField("#email-signup", ".email-error", validateEmail, true));
$("#password-signup-confirm").addEventListener("keyup", checkPasswordsMatch);

const updateButtonState = () => {
    const allLoginFieldsFilled = Array.from(document.querySelectorAll('#form-login input:not([type="checkbox"])')).every(input => input.value.trim() !== '');
    const allLoginFieldsValid = Array.from(document.querySelectorAll('#form-login .invalid')).length === 0;
    const isRememberChecked = $('#remember').checked;
    $('#login-button').disabled = !(allLoginFieldsFilled && allLoginFieldsValid && isRememberChecked);
    $('#login-button').classList.toggle('btn-login', !$('#login-button').disabled);
    $('#login-button').classList.toggle('btn-login-disabled', $('#login-button').disabled);

    const allSignupFieldsFilled = Array.from(document.querySelectorAll('#form-signup input:not([type="checkbox"])')).every(input => input.value.trim() !== '');
    const allSignupFieldsValid = Array.from(document.querySelectorAll('#form-signup .invalid')).length === 0;
    const isTermsAccepted = $('#acept').checked;
    $('#signup-button').disabled = !(allSignupFieldsFilled && allSignupFieldsValid && isTermsAccepted);
    $('#signup-button').classList.toggle('btn-login', !$('#signup-button').disabled);
    $('#signup-button').classList.toggle('btn-login-disabled', $('#signup-button').disabled);
};

$('#remember').addEventListener('change', updateButtonState);
$('#acept').addEventListener('change', updateButtonState);

document.addEventListener('DOMContentLoaded', updateButtonState);
document.querySelectorAll('#form-login input, #form-signup input').forEach(input => {
    input.addEventListener('keyup', updateButtonState);
});