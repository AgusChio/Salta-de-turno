const $ = (selector) => document.querySelector(selector);
const addClass = (selector, clas) => $(selector).classList.add(clas);
const removeClass = (selector, clas) => $(selector).classList.remove(clas);

const formLogin = $(".container-form-login");
const signupLoginLink = formLogin.querySelectorAll(".btn-title");

signupLoginLink.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        if (link.getAttribute("data-form") === "login") {
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

function handleAcceptTerms() {
    $('#acept').checked = true;

    const modalElement = $('#staticBackdrop');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
}

$('#staticBackdrop .btn-success').addEventListener('click', handleAcceptTerms);

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
    const confirmPassword = $("#password-signup-confirm").value;
    if (password === confirmPassword) {
        $(".password-match-error").classList.add("none");
        $("#password-signup-confirm").classList.remove("invalid");
    } else {
        $(".password-match-error").classList.remove("none");
        $("#password-signup-confirm").classList.add("invalid");
    }
    updateButtonState();
};

$("#password-signup").addEventListener("input", checkPasswordsMatch);
$("#password-signup-confirm").addEventListener("input", checkPasswordsMatch);

//Promesas
$("#form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    checkField("#name", ".name-error", validateEmpty, true);
    checkField("#email-login", ".email-error", validateEmail);

    const email = $("#email-login").value.toLowerCase();
    const password = $("#password").value;

    if (Array.from($(".container-form-login .invalid")).length === 0) {
        try {
            const response = await fetch('https://api-salta-de-turno.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                Swal.fire({
                    title: 'Error',
                    text: errorData.message || 'Error en el login',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            } else {
                const data = await response.json();
                document.cookie = `username=${encodeURIComponent(data.user.email)}; path=/;`;
                document.cookie = `fullname=${encodeURIComponent(data.user.fullName)}; path=/;`;
                document.cookie = `username=${email}; path=/; expires=${new Date(new Date().getTime() + 86400 * 1000).toUTCString()};`;
                Swal.fire({
                    title: 'Inicio de Sesión Exitoso',
                    text: 'Bienvenido a Salta de Turno!',
                    icon: 'success',
                    timer: 3000,
                    confirmButtonText: 'Ok'
                }).then(() => {
                    window.location.href = '/index.html';
                });
                var rememberMeChecked = document.getElementById('remember').checked;
                if (rememberMeChecked) {
                    var currentDate = new Date();
            
                    currentDate.setTime(currentDate.getTime() + (14 * 24 * 60 * 60 * 1000));
            
                    var expires = "expires=" + currentDate.toUTCString();
                    document.cookie = "username=" + email + "; " + expires + "; path=/";
                }
            }
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
    checkField("#name", ".name-error", validateEmpty, true);
    checkField("#email-signup", ".email-error", validateEmail);
    checkPasswordsMatch();

    const terminosYCondiciones = $('#acept').checked;
    if (!terminosYCondiciones) {
        Swal.fire({
            title: 'Error',
            text: 'Es necesario que acepte los términos y condiciones para registrarse.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const emailSignup = $("#email-signup").value;
    if (!validateEmail(emailSignup)) {
        Swal.fire({
            title: 'Error',
            text: 'El email ingresado no es válido.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    if (Array.from($(".container-form-signUp")).length === 0) {
        const name = $("#name").value;
        const email = $("#email-signup").value.toLowerCase(); 
        const password = $("#password-signup").value;
        const apiKey = "";
        const rol = "user";
        const terminosYCondiciones = $('#acept').checked;
        try {
            const response = await fetch('https://api-salta-de-turno.onrender.com/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, apiKey, rol, terminosYCondiciones })
            });

            if (!response.ok) {
                if (response.status === 409) {
                    Swal.fire({
                        title: 'Error',
                        text: 'El email ingresado ya está en uso.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                } else {
                    throw new Error('Error en el registro');
                }
            } else {
                const data = await response.json();
                document.cookie = `username=${encodeURIComponent(data.user.email)}; path=/;`;
                document.cookie = `fullname=${encodeURIComponent(data.user.fullName)}; path=/;`;
                document.cookie = `username=${emailSignup}; path=/; expires=${new Date(new Date().getTime() + 86400 * 1000).toUTCString()};`;
                Swal.fire({
                    title: 'Registro Exitoso',
                    text: '¡Tu cuenta ha sido creada exitosamente!',
                    icon: 'success',
                    timer: 3000,
                    confirmButtonText: 'Ok'
                }).then(() => {
                    window.location.href = '/index.html';
                });
            }
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


const updateButtonState = () => {
    const allLoginFieldsFilled = Array.from(document.querySelectorAll('#form-login input:not([type="checkbox"])')).every(input => input.value.trim() !== '');
    const allLoginFieldsValid = Array.from(document.querySelectorAll('#form-login .invalid')).length === 0;
    $('#login-button').disabled = !(allLoginFieldsFilled && allLoginFieldsValid);
    $('#login-button').classList.toggle('btn-login', !$('#login-button').disabled);
    $('#login-button').classList.toggle('btn-login-disabled', $('#login-button').disabled);

    const allSignupFieldsFilled = Array.from(document.querySelectorAll('#form-signup input:not([type="checkbox"])')).every(input => input.value.trim() !== '');
    const allSignupFieldsValid = Array.from(document.querySelectorAll('#form-signup .invalid')).length === 0;

    $('#signup-button').disabled = !(allSignupFieldsFilled && allSignupFieldsValid);
    $('#signup-button').classList.toggle('btn-login', !$('#signup-button').disabled);
    $('#signup-button').classList.toggle('btn-login-disabled', $('#signup-button').disabled);

};

document.addEventListener('DOMContentLoaded', updateButtonState);
document.querySelectorAll('#form-login input, #form-signup input').forEach(input => {
    input.addEventListener('keyup', updateButtonState);
});

$("#name").addEventListener("keyup", () => checkField("#name", ".name-error", validateEmpty, true));
$("#email-login").addEventListener("keyup", () => checkField("#email-login", ".email-error", validateEmail, true));
$("#password-signup").addEventListener("keyup", () => checkField("#password-signup", ".password-error", validatePassword));
$("#password-signup").addEventListener("keyup", checkPasswordsMatch);
$("#password-signup-confirm").addEventListener("keyup", checkPasswordsMatch);
