function checkLoginStatus() {
    console.log('Cookie username:', document.cookie.includes('username='));
    var isLoggedIn = document.cookie.split(';').some((item) => item.trim().startsWith('username='));

    var loginLink = document.getElementById('login-link');
    var logoutLink = document.getElementById('logout-link');

    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }
}

function logout() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    checkLoginStatus();
}

window.onload = checkLoginStatus;