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

$("#form-signup").addEventListener("submit", (e) => {
    e.preventDefault();
    checkField("#name", ".name-error", validateEmpty, true);
    checkField("#email-signup", ".email-error", validateEmail);
    checkField("#password-signup", ".password-error", validatePassword);
    checkPasswordsMatch();

    if (Array.from($(".container-form-login .invalid")).length === 0) {
        console.log('Formulario de registro enviado con éxito');
    }
});

$("#form-login").addEventListener("submit", (e) => {
    e.preventDefault();
    checkField("#email-login", ".email-error", validateEmail);
    checkField("#password", ".password-error", validatePassword);

    if (Array.from($(".container-form-login .invalid")).length === 0) {
        console.log('Formulario de inicio de sesión enviado con éxito');
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