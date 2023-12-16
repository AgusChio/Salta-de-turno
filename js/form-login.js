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
const validateEmpty = (value) => value != "";
const validatePassword = (password) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(password);

const checkField = (id, errorClass, validationFunc) => {
    if (!validationFunc($(id).value)) {
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
    if (password !== confirmPassword) {
        removeClass(".password-match-error", "none");
        addClass("#password-signup-confirm", "invalid");
        return false;
    } else {
        addClass(".password-match-error", "none");
        removeClass("#password-signup-confirm", "invalid");
        return true;
    }
};

$("#form-signup").addEventListener("submit", (e) => {
    e.preventDefault();
    checkField("#name", ".name-error", validateEmpty);
    checkField("#user-signup", ".user-error", validateEmpty);
    checkField("#password-signup", ".password-error", validatePassword);
    checkPasswordsMatch();

    if (Array.from(formLogin.querySelectorAll('.invalid')).length === 0) {
        console.log('Formulario enviado con éxito');
    }
});

$("#name").addEventListener("keyup", () => checkField("#name", ".name-error", validateEmpty));
$("#user-signup").addEventListener("keyup", () => checkField("#user-signup", ".user-error", validateEmpty));
$("#password-signup").addEventListener("keyup", () => checkField("#password-signup", ".password-error", validatePassword));
$("#password-signup-confirm").addEventListener("keyup", checkPasswordsMatch);