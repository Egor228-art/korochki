// components/auth.js - Система авторизации и управления данными
class SimpleAuth {
    constructor() {
        this.initDefaultData();
    }

    initDefaultData() {
        // Инициализация пользователей
        if (!localStorage.getItem('users')) {
            const defaultUsers = [
                {
                    id: '1',
                    email: 'admin@korochki.est',
                    password: 'KorokNET',
                    FIO: 'Администратор Системы',
                    name: 'Admin',
                    username: 'Admin',
                    telephone: '+79999999999',
                    role: 'admin',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }

        // Инициализация курсов
        if (!localStorage.getItem('courses')) {
            const defaultCourses = [
                {
                    id: '1',
                    name: 'Веб-разработка',
                    description: 'Освойте современные веб-технологии: HTML, CSS, JavaScript и фреймворки.',
                    price: 15000,
                    duration: '8 недель',
                    category: 'Программирование',
                    image: '💻',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    name: 'Анализ данных',
                    description: 'Научитесь анализировать данные с помощью Python и SQL.',
                    price: 18000,
                    duration: '6 недель',
                    category: 'Аналитика',
                    image: '📊',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '3',
                    name: 'Цифровой маркетинг',
                    description: 'Освойте инструменты цифрового маркетинга.',
                    price: 12000,
                    duration: '4 недели',
                    category: 'Маркетинг',
                    image: '🎯',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '4',
                    name: 'Мобильная разработка',
                    description: 'Создавайте приложения для iOS и Android.',
                    price: 20000,
                    duration: '10 недель',
                    category: 'Программирование',
                    image: '📱',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '5',
                    name: 'Графический дизайн',
                    description: 'Освойте Photoshop, Illustrator и Figma.',
                    price: 14000,
                    duration: '7 недель',
                    category: 'Дизайн',
                    image: '🎨',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '6',
                    name: 'Искусственный интеллект',
                    description: 'Введение в машинное обучение и нейронные сети.',
                    price: 25000,
                    duration: '12 недель',
                    category: 'AI/ML',
                    image: '🤖',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('courses', JSON.stringify(defaultCourses));
        }

        // Инициализация заявок
        if (!localStorage.getItem('applications')) {
            localStorage.setItem('applications', JSON.stringify([]));
        }
    }

    async init() {
        console.log('✅ Auth system ready');
        return true;
    }

    // ========== АВТОРИЗАЦИЯ ==========
    
    async register(userData) {
        const users = this.getUsers();
        
        if (users.find(u => u.email === userData.email)) {
            throw new Error('Пользователь с таким email уже существует');
        }
        
        const newUser = {
            id: Date.now().toString(),
            email: userData.email,
            password: userData.password,
            FIO: userData.FIO || '',
            name: userData.name || '',
            username: userData.username || '',
            telephone: userData.telephone || '',
            role: 'user',
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        return newUser;
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

    // ========== ПОЛЬЗОВАТЕЛИ ==========
    
    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    addUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return newUser;
    }

    updateUser(userId, userData) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
            localStorage.setItem('users', JSON.stringify(users));
            return users[index];
        }
        return null;
    }

    deleteUser(userId) {
        const users = this.getUsers().filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }

    // ========== ЗАЯВКИ ==========
    
    async getUserApplications() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return [];
        
        const allApplications = this.getApplications();
        return allApplications.filter(app => app.user === currentUser.id);
    }

    getAllApplications() {
        return this.getApplications();
    }

    getApplications() {
        return JSON.parse(localStorage.getItem('applications') || '[]');
    }

    async createApplication(applicationData) {
        const applications = this.getApplications();
        
        const newApplication = {
            id: Date.now().toString(),
            ...applicationData,
            status: 'Новая',
            created: new Date().toISOString()
        };
        
        applications.push(newApplication);
        localStorage.setItem('applications', JSON.stringify(applications));
        
        return newApplication;
    }

    updateApplicationStatus(applicationId, newStatus) {
        const applications = this.getApplications();
        const index = applications.findIndex(a => a.id === applicationId);
        if (index !== -1) {
            applications[index].status = newStatus;
            localStorage.setItem('applications', JSON.stringify(applications));
            return applications[index];
        }
        return null;
    }

    // ========== КУРСЫ ==========
    
    async getCourses() {
        return JSON.parse(localStorage.getItem('courses') || '[]');
    }

    addCourse(courseData) {
        const courses = this.getCourses();
        const newCourse = {
            id: Date.now().toString(),
            ...courseData,
            createdAt: new Date().toISOString()
        };
        courses.push(newCourse);
        localStorage.setItem('courses', JSON.stringify(courses));
        return newCourse;
    }

    updateCourse(courseId, courseData) {
        const courses = this.getCourses();
        const index = courses.findIndex(c => c.id === courseId);
        if (index !== -1) {
            courses[index] = { ...courses[index], ...courseData };
            localStorage.setItem('courses', JSON.stringify(courses));
            return courses[index];
        }
        return null;
    }

    deleteCourse(courseId) {
        const courses = this.getCourses().filter(c => c.id !== courseId);
        localStorage.setItem('courses', JSON.stringify(courses));
        return true;
    }
}

window.pb = new SimpleAuth();