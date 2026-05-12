// js/auth.js - Простая система авторизации для Vercel
class SimpleAuth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users') || '[]');
    }

    async init() {
        console.log('Auth system ready');
    }

    async register(userData) {
        const users = this.getUsers();
        
        // Проверяем, существует ли пользователь
        if (users.find(u => u.email === userData.email)) {
            throw new Error('Пользователь с таким email уже существует');
        }
        
        // Создаем нового пользователя
        const newUser = {
            id: Date.now().toString(),
            email: userData.email,
            password: userData.password,
            FIO: userData.FIO || '',
            name: userData.name || '',
            telephone: userData.telephone || '',
            role: 'user',
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Автоматически входим
        return this.login(userData.email, userData.password);
    }

    async login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Неверный email или пароль');
        }
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }

    logout() {
        localStorage.removeItem('currentUser');
    }

    isLoggedIn() {
        return !!localStorage.getItem('currentUser');
    }

    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    async getUserApplications() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return [];
        
        const allApplications = JSON.parse(localStorage.getItem('applications') || '[]');
        return allApplications.filter(app => app.user === currentUser.id);
    }

    async createApplication(applicationData) {
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        
        const newApplication = {
            id: Date.now().toString(),
            ...applicationData,
            created: new Date().toISOString()
        };
        
        applications.push(newApplication);
        localStorage.setItem('applications', JSON.stringify(applications));
        
        return newApplication;
    }

    async getCourses() {
        // Загружаем курсы из статического файла
        try {
            const response = await fetch('/data/courses.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading courses:', error);
            return [];
        }
    }
}

window.pb = new SimpleAuth();