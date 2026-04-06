// Регистрация и логин

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Маска телефона
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => phoneMask(e.target));
        }
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleRegister(e) {
    e.preventDefault();
    
    const login = document.getElementById('login').value.trim();
    const password = document.getElementById('password').value;
    const full_name = document.getElementById('full_name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    
    // Очистка ошибок
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
    
    // Валидация
    let hasError = false;
    
    if (!/^[a-zA-Z0-9]{6,}$/.test(login)) {
        showError('loginError', 'Логин: латиница и цифры, не менее 6 символов');
        hasError = true;
    }
    if (password.length < 8) {
        showError('passwordError', 'Пароль не менее 8 символов');
        hasError = true;
    }
    if (!/^[а-яА-ЯёЁ\s\-]+$/.test(full_name)) {
        showError('nameError', 'ФИО: только кириллица, пробелы и дефис');
        hasError = true;
    }
    if (!/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(phone)) {
        showError('phoneError', 'Формат: 8(XXX)XXX-XX-XX');
        hasError = true;
    }
    if (!/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(email)) {
        showError('emailError', 'Введите корректный email');
        hasError = true;
    }
    
    if (hasError) return;
    
    // Проверка уникальности логина
    const existing = await getUserByLogin(login);
    if (existing) {
        showError('loginError', 'Логин уже существует');
        return;
    }
    
    const hashedPassword = await hashPassword(password);
    
    await addUser({
        login: login,
        password: hashedPassword,
        full_name: full_name,
        phone: phone,
        email: email,
        is_admin: 0
    });
    
    alert('Регистрация успешна! Теперь войдите.');
    window.location.href = 'login.html';
}

async function handleLogin(e) {
    e.preventDefault();
    
    const login = document.getElementById('login').value.trim();
    const password = document.getElementById('password').value;
    
    // Очистка ошибок
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) errorDiv.textContent = '';
    
    if (!login || !password) {
        if (errorDiv) errorDiv.textContent = 'Заполните все поля';
        return;
    }
    
    // Ждём открытия БД
    await openDB();
    
    const user = await getUserByLogin(login);
    
    if (!user) {
        if (errorDiv) errorDiv.textContent = 'Неверный логин или пароль';
        return;
    }
    
    const hashedInput = await hashPassword(password);
    
    if (user.password !== hashedInput) {
        if (errorDiv) errorDiv.textContent = 'Неверный логин или пароль';
        return;
    }
    
    // Сохраняем в sessionStorage
    sessionStorage.setItem('user', JSON.stringify({
        id: user.id,
        login: user.login,
        full_name: user.full_name,
        is_admin: user.is_admin
    }));
    
    // Редирект
    window.location.href = 'dashboard.html';
}

function showError(elementId, message) {
    const errorDiv = document.getElementById(elementId);
    if (errorDiv) errorDiv.textContent = message;
}