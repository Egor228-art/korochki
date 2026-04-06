// Конфиг
const PB_URL = 'http://127.0.0.1:8090';

// Глобальная переменная
let currentUser = null;

// Загрузка пользователя
function loadCurrentUser() {
    try {
        const userJson = localStorage.getItem('pb_user');
        const token = localStorage.getItem('pb_token');
        
        if (userJson && token && userJson !== 'undefined' && token !== 'undefined') {
            currentUser = JSON.parse(userJson);
            console.log('✅ Пользователь загружен:', currentUser?.email, 'is_admin:', currentUser?.is_admin);
            return currentUser;
        }
    } catch (e) {
        console.error('Ошибка загрузки пользователя:', e);
    }
    currentUser = null;
    return null;
}

function saveCurrentUser(user, token) {
    if (!user || !token) return;
    currentUser = user;
    localStorage.setItem('pb_user', JSON.stringify(user));
    localStorage.setItem('pb_token', token);
    console.log('✅ Пользователь сохранён:', user.email);
}

function logout() {
    localStorage.removeItem('pb_user');
    localStorage.removeItem('pb_token');
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
        alert('Доступ запрещён. Требуются права администратора.');
        window.location.href = 'dashboard.html';
        return false;
    }
    return true;
}

// API запрос с токеном пользователя
async function pbRequest(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('pb_token');
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token && token !== 'undefined') {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log(`📡 ${method} ${endpoint}`);
    
    const response = await fetch(`${PB_URL}/api${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });
    
    if (!response.ok) {
        let errorMessage = 'Ошибка запроса';
        try {
            const error = await response.json();
            errorMessage = error.message || errorMessage;
        } catch(e) {}
        throw new Error(errorMessage);
    }
    
    return response.json();
}

// Регистрация
async function pbRegister(data) {
    const response = await fetch(`${PB_URL}/api/collections/users/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка регистрации');
    }
    return response.json();
}

// Логин
async function pbLogin(email, password) {
    const response = await fetch(`${PB_URL}/api/collections/users/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: email, password })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Неверный логин или пароль');
    }
    const result = await response.json();
    saveCurrentUser(result.record, result.token);
    return result;
}

// Обновить профиль пользователя
async function updateUserProfile(userId, data) {
    return pbRequest(`/collections/users/records/${userId}`, 'PATCH', data);
}

// ========== КУРСЫ ==========
async function getCourses() {
    try {
        const result = await pbRequest('/collections/courses/records?sort=name');
        return result.items || [];
    } catch (e) {
        console.error('Ошибка загрузки курсов:', e);
        return [];
    }
}

async function createCourse(data) {
    return pbRequest('/collections/courses/records', 'POST', data);
}

async function deleteCourse(id) {
    return pbRequest(`/collections/courses/records/${id}`, 'DELETE');
}

// ========== ЗАЯВКИ ==========
async function getUserApplications(userId) {
    try {
        const result = await pbRequest('/collections/applications/records');
        const allApps = result.items || [];
        const filtered = allApps.filter(app => app.user === userId);
        return filtered;
    } catch (e) {
        console.error('Ошибка загрузки заявок:', e);
        return [];
    }
}

async function getAllApplications() {
    try {
        const result = await pbRequest('/collections/applications/records');
        const items = result.items || [];
        for (let app of items) {
            try {
                const userData = await pbRequest(`/collections/users/records/${app.user}`);
                app.user_name = userData.full_name || userData.email;
            } catch(e) {
                app.user_name = app.user;
            }
        }
        return items;
    } catch (e) {
        console.error('Ошибка загрузки заявок:', e);
        return [];
    }
}

async function createApplication(data) {
    return pbRequest('/collections/applications/records', 'POST', data);
}

async function updateApplicationStatus(id, status) {
    return pbRequest(`/collections/applications/records/${id}`, 'PATCH', { status });
}

// ========== ОТЗЫВЫ ==========
async function getAllReviews() {
    try {
        const result = await pbRequest('/collections/reviews/records');
        const items = result.items || [];
        // Подтягиваем данные пользователей и курсов
        for (let review of items) {
            try {
                const userData = await pbRequest(`/collections/users/records/${review.user}`);
                review.user_name = userData.full_name || userData.email;
            } catch(e) {}
            try {
                const appData = await pbRequest(`/collections/applications/records/${review.application}`);
                review.course_name = appData.course_name;
            } catch(e) {}
        }
        return items;
    } catch (e) {
        console.error('Ошибка загрузки отзывов:', e);
        return [];
    }
}

async function getReviewByApplication(applicationId) {
    try {
        const result = await pbRequest('/collections/reviews/records');
        const review = result.items?.find(r => r.application === applicationId);
        return review || null;
    } catch {
        return null;
    }
}

async function createReview(data) {
    return pbRequest('/collections/reviews/records', 'POST', data);
}

// ========== ПОЛЬЗОВАТЕЛИ ==========
async function getAllUsers() {
    try {
        const result = await pbRequest('/collections/users/records?sort=created');
        return result.items || [];
    } catch (e) {
        console.error('Ошибка загрузки пользователей:', e);
        return [];
    }
}

async function createUser(data) {
    return pbRequest('/collections/users/records', 'POST', data);
}

async function deleteUser(id) {
    return pbRequest(`/collections/users/records/${id}`, 'DELETE');
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ==========
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
}

function phoneMask(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    let formatted = '';
    if (value.length > 0) formatted = '8(' + value.substring(1,4);
    if (value.length >= 4) formatted += ')' + value.substring(4,7);
    if (value.length >= 7) formatted += '-' + value.substring(7,9);
    if (value.length >= 9) formatted += '-' + value.substring(9,11);
    input.value = formatted;
}

// ========== UI ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 Страница загружена');
    loadCurrentUser();
    initBurger();
    updateNavigation();
});

function initBurger() {
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    if (!burger || !navMenu) return;
    burger.addEventListener('click', () => navMenu.classList.toggle('active'));
}

function updateNavigation() {
    loadCurrentUser();
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    let menuHtml = '';
    if (currentUser) {
        menuHtml += '<a href="dashboard.html">Мои заявки</a>';
        menuHtml += '<a href="courses.html">Курсы</a>';
        menuHtml += '<a href="application_form.html">Новая заявка</a>';
        menuHtml += '<a href="profile.html">Профиль</a>';
        if (currentUser.is_admin === true) {
            menuHtml += '<a href="admin.html">Админ-панель</a>';
        }
        menuHtml += `<a href="#" id="logoutLink">Выйти (${escapeHtml(currentUser.full_name?.split(' ')[0] || currentUser.email)})</a>`;
    } else {
        menuHtml += '<a href="index.html">Главная</a>';
        menuHtml += '<a href="courses.html">Курсы</a>';
        menuHtml += '<a href="login.html">Войти</a>';
        menuHtml += '<a href="register.html">Регистрация</a>';
    }
    navMenu.innerHTML = menuHtml;
    
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => { 
            e.preventDefault(); 
            logout(); 
        });
    }
}