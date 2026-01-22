const API_BASE = "http://127.0.0.1:8000/api/auth";

// Save token
function setToken(token) {
    localStorage.setItem("authToken", token);
}

// Get token
function getToken() {
    return localStorage.getItem("authToken");
}

// Logout
function logout() {
    localStorage.removeItem("authToken");
    window.location.href = "login.html";
}
