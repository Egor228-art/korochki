// components/navbar.js
class CustomNavbar extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.initialized = false;
    }

    async connectedCallback() {
        // Показываем временный контент сразу
        this.renderPlaceholder();
        
        // Ждем инициализации PocketBase
        await this.waitForPocketBase();
        await this.render();
        this.addEventListeners();
        
        // Обновляем иконки после рендера
        if (typeof feather !== 'undefined') {
            setTimeout(() => feather.replace(), 100);
        }
    }

    renderPlaceholder() {
        this.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 1200px; margin: 0 auto;">
                <a href="index.html" style="font-size: 1.5rem; font-weight: 700; color: #3b82f6; text-decoration: none; display: flex; align-items: center;">
                    <span style="margin-right: 0.5rem;">📚</span>
                    Корочки.Есть
                </a>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <a href="index.html" style="color: #4b5563; text-decoration: none;">Главная</a>
                    <a href="new-application.html" style="color: #4b5563; text-decoration: none;">Курсы</a>
                    <a href="about.html" style="color: #4b5563; text-decoration: none;">О нас</a>
                    <div style="display: flex; gap: 1rem;">
                        <a href="login.html" style="color: #3b82f6; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid #3b82f6; border-radius: 0.375rem;">Вход</a>
                        <a href="register.html" style="background-color: #3b82f6; color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 0.375rem;">Регистрация</a>
                    </div>
                </div>
            </div>
        `;
    }

    async waitForPocketBase() {
        if (window.pb && typeof window.pb.init === 'function') {
            await pb.init();
            return;
        }
        
        let attempts = 0;
        while (!window.pb && attempts < 20) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        this.initialized = true;
    }

    async render() {
        const isLoggedIn = window.pb ? pb.isLoggedIn() : false;
        const currentUser = window.pb ? pb.getCurrentUser() : null;
        const isAdmin = currentUser && currentUser.role === 'admine';
        
        this.shadow.innerHTML = `
            <style>
                /* Существующие стили остаются без изменений */
                :host {
                    display: block;
                    background-color: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    width: 100%;
                    position: relative;
                    z-index: 1000;
                }
                .navbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .logo {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #3b82f6;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                }
                .logo-icon {
                    margin-right: 0.5rem;
                    width: 24px;
                    height: 24px;
                }
                .nav-links {
                    display: flex;
                    gap: 1.5rem;
                }
                .nav-link {
                    color: #4b5563;
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.2s;
                }
                .nav-link:hover {
                    color: #3b82f6;
                }
                .auth-buttons {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                .auth-button {
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s;
                    border: none;
                    cursor: pointer;
                    font-family: inherit;
                }
                .login {
                    color: #3b82f6;
                    border: 1px solid #3b82f6;
                    background: white;
                }
                .login:hover {
                    background-color: #eff6ff;
                }
                .register {
                    background-color: #3b82f6;
                    color: white;
                    border: 1px solid #3b82f6;
                }
                .register:hover {
                    background-color: #2563eb;
                }
                .profile-link {
                    color: #4b5563;
                    text-decoration: none;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    transition: all 0.2s;
                    cursor: pointer;
                }
                .profile-link:hover {
                    background-color: #f3f4f6;
                    color: #3b82f6;
                }
                .admin-link {
                    color: #dc2626;
                    border: 1px solid #dc2626;
                    padding: 0.3rem 0.5rem;
                    border-radius: 0.375rem;
                    text-decoration: none;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                }
                .admin-link:hover {
                    background-color: #fef2f2;
                }
                .user-menu {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                @media (max-width: 768px) {
                    .navbar {
                        flex-direction: column;
                        padding: 1rem;
                    }
                    .nav-links {
                        margin: 1rem 0;
                    }
                    .user-menu {
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                }
            </style>
            <nav class="navbar">
                <a href="index.html" class="logo">
                    <span class="p-2 rounded-lg mr-2" style="padding: 0;" font-size="30px;">📖</span>
                    Корочки.Есть
                </a>
                <div class="nav-links">
                    <a href="index.html" class="nav-link">Главная</a>
                    <a href="new-application.html" class="nav-link">Курсы</a>
                    <a href="about.html" class="nav-link">О нас</a>
                </div>
                <div class="auth-buttons">
                    ${isLoggedIn ? 
                        `<div class="user-menu">
                            ${isAdmin ? 
                                `<a href="http://127.0.0.1:8090/_/" target="_blank" class="admin-link">
                                    Админка
                                </a>` : 
                                `<a href="applications.html" class="profile-link">
                                    <i data-feather="user"></i>
                                    ${currentUser?.name || currentUser?.username || currentUser?.email || 'Профиль'}
                                </a>`
                            }
                            <button id="logoutBtn" class="auth-button login">Выйти</button>
                        </div>` :
                        `<a href="login.html" class="auth-button login">Вход</a>
                        <a href="register.html" class="auth-button register">Регистрация</a>`
                    }
                </div>
            </nav>
        `;
    }

    addEventListeners() {
        if (window.pb && pb.isLoggedIn()) {
            const logoutBtn = this.shadow.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    pb.logout();
                    window.location.href = 'index.html';
                });
            }
        }
    }
}

customElements.define('custom-navbar', CustomNavbar);