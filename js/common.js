// Конфиг для Vercel
let currentUser = null;

// Загрузка пользователя
function loadCurrentUser() {
    try {
        const userJson = localStorage.getItem('user');
        if (userJson && userJson !== 'undefined') {
            currentUser = JSON.parse(userJson);
            return currentUser;
        }
    } catch (e) {
        console.error('Ошибка загрузки:', e);
    }
    currentUser = null;
    return null;
}

function saveCurrentUser(user, token) {
    currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    currentUser = null;
    window.location.href = 'index.html';
}

function requireAuth() {
    loadCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function requireAdmin() {
    loadCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    if (!currentUser.is_admin) {
        alert('Доступ запрещён');
        window.location.href = 'dashboard.html';
        return false;
    }
    return true;
}

// API запрос
async function api(method, path, body = null) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = token;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(path, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Ошибка сервера');
    }

    return data;
}

// Auth
async function pbRegister(data) {
    return api('POST', '/api/register', data);
}

async function pbLogin(email, password) {
    const result = await api('POST', '/api/login', { email, password });
    if (result.user) {
        saveCurrentUser(result.user, result.token);
    }
    return result;
}

async function updateUserProfile(userId, data) {
    return api('PATCH', `/api/users?id=${userId}`, data);
}

// Courses
async function getCourses() {
    const result = await api('GET', '/api/courses');
    return result.items || [];
}

async function createCourse(data) {
    return api('POST', '/api/courses', data);
}

async function deleteCourse(id) {
    return api('DELETE', `/api/courses?id=${id}`);
}

// Applications
async function getUserApplications(userId) {
    const result = await api('GET', `/api/applications?userId=${userId}`);
    return result.applications || [];
}

async function getAllApplications() {
    const result = await api('GET', '/api/applications');
    return result.applications || [];
}

async function createApplication(data) {
    return api('POST', '/api/applications', data);
}

async function updateApplicationStatus(id, status) {
    return api('PATCH', `/api/applications?id=${id}`, { status });
}

// Reviews
async function getAllReviews() {
    const result = await api('GET', '/api/reviews');
    return result.reviews || [];
}

async function getReviewByApplication(applicationId) {
    try {
        const result = await api('GET', `/api/reviews?applicationId=${applicationId}`);
        return result.review || null;
    } catch {
        return null;
    }
}

async function createReview(data) {
    return api('POST', '/api/reviews', data);
}

// Users
async function getAllUsers() {
    const result = await api('GET', '/api/users');
    return result.users || [];
}

// Helpers
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
}

function phoneMask(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    let formatted = '8(' + value.substring(1,4);
    if (value.length >= 4) formatted += ')' + value.substring(4,7);
    if (value.length >= 7) formatted += '-' + value.substring(7,9);
    if (value.length >= 9) formatted += '-' + value.substring(9,11);
    input.value = formatted;
}

// UI
document.addEventListener('DOMContentLoaded', () => {
    loadCurrentUser();
    initBurger();
    updateNavigation();
});

function initBurger() {
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    if (burger && navMenu) {
        burger.addEventListener('click', () => navMenu.classList.toggle('active'));
    }
}

function updateNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    let html = '';
    if (currentUser) {
        html += '<a href="dashboard.html">Мои заявки</a>';
        html += '<a href="courses.html">Курсы</a>';
        html += '<a href="application_form.html">Новая заявка</a>';
        html += '<a href="profile.html">Профиль</a>';
        if (currentUser.is_admin) {
            html += '<a href="admin.html">Админ-панель</a>';
        }
        html += `<a href="#" id="logoutLink">Выйти (${escapeHtml(currentUser.full_name?.split(' ')[0] || currentUser.email)})</a>`;
    } else {
        html += '<a href="index.html">Главная</a>';
        html += '<a href="courses.html">Курсы</a>';
        html += '<a href="login.html">Войти</a>';
        html += '<a href="register.html">Регистрация</a>';
    }
    navMenu.innerHTML = html;
    
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => { e.preventDefault(); logout(); });
    }
}