// components/auth.js - ПРОСТАЯ версия
(function() {
    'use strict';
    
    // Создаем админа если нет пользователей
    if (!localStorage.getItem('users')) {
        const users = [{
            id: '1',
            email: 'admin@korochki.est',
            password: 'KorokNET',
            FIO: 'Администратор Системы',
            name: 'Admin',
            username: 'Admin',
            telephone: '+79999999999',
            role: 'admin',
            createdAt: new Date().toISOString()
        }];
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    if (!localStorage.getItem('courses')) {
        const courses = [
            {id:'1',name:'Веб-разработка',description:'HTML, CSS, JavaScript и фреймворки',price:15000,duration:'8 недель',category:'Программирование',image:'💻',createdAt:new Date().toISOString()},
            {id:'2',name:'Анализ данных',description:'Python, SQL и библиотеки анализа',price:18000,duration:'6 недель',category:'Аналитика',image:'📊',createdAt:new Date().toISOString()},
            {id:'3',name:'Цифровой маркетинг',description:'SEO, SMM, контекстная реклама',price:12000,duration:'4 недели',category:'Маркетинг',image:'🎯',createdAt:new Date().toISOString()},
            {id:'4',name:'Мобильная разработка',description:'iOS и Android приложения',price:20000,duration:'10 недель',category:'Программирование',image:'📱',createdAt:new Date().toISOString()},
            {id:'5',name:'Графический дизайн',description:'Photoshop, Illustrator, Figma',price:14000,duration:'7 недель',category:'Дизайн',image:'🎨',createdAt:new Date().toISOString()},
            {id:'6',name:'Искусственный интеллект',description:'Машинное обучение и нейросети',price:25000,duration:'12 недель',category:'AI/ML',image:'🤖',createdAt:new Date().toISOString()}
        ];
        localStorage.setItem('courses', JSON.stringify(courses));
    }
    
    if (!localStorage.getItem('applications')) {
        localStorage.setItem('applications', JSON.stringify([]));
    }

    window.pb = {
        init: async function() {
            console.log('✅ Система готова');
            return true;
        },
        
        // АВТОРИЗАЦИЯ
        register: async function(userData) {
            const users = JSON.parse(localStorage.getItem('users'));
            if (users.find(u => u.email === userData.email)) {
                throw new Error('Пользователь с таким email уже существует');
            }
            const newUser = {
                id: Date.now().toString(),
                email: userData.email,
                password: userData.password,
                FIO: userData.FIO || '',
                name: userData.name || '',
                username: userData.username || userData.name || '',
                telephone: userData.telephone || '',
                role: 'user',
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            return newUser;
        },
        
        login: async function(email, password) {
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.email === email && u.password === password);
            if (!user) throw new Error('Неверный email или пароль');
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        },
        
        logout: function() {
            localStorage.removeItem('currentUser');
        },
        
        isLoggedIn: function() {
            return !!localStorage.getItem('currentUser');
        },
        
        getCurrentUser: function() {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        },
        
        // ПОЛЬЗОВАТЕЛИ
        getUsers: function() {
            return JSON.parse(localStorage.getItem('users'));
        },
        
        addUser: function(userData) {
            const users = this.getUsers();
            const newUser = {...userData, id: Date.now().toString(), createdAt: new Date().toISOString()};
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            return newUser;
        },
        
        updateUser: function(userId, userData) {
            const users = this.getUsers();
            const index = users.findIndex(u => u.id === userId);
            if (index !== -1) {
                users[index] = {...users[index], ...userData};
                localStorage.setItem('users', JSON.stringify(users));
                return users[index];
            }
            return null;
        },
        
        deleteUser: function(userId) {
            const users = this.getUsers().filter(u => u.id !== userId);
            localStorage.setItem('users', JSON.stringify(users));
        },
        
        // ЗАЯВКИ
        getAllApplications: function() {
            return JSON.parse(localStorage.getItem('applications'));
        },
        
        getUserApplications: async function() {
            const user = this.getCurrentUser();
            if (!user) return [];
            return this.getAllApplications().filter(a => a.user === user.id);
        },
        
        createApplication: async function(data) {
            const apps = this.getAllApplications();
            const newApp = {...data, id: Date.now().toString(), status: 'Новая', created: new Date().toISOString()};
            apps.push(newApp);
            localStorage.setItem('applications', JSON.stringify(apps));
            return newApp;
        },
        
        updateApplicationStatus: function(appId, status) {
            const apps = this.getAllApplications();
            const index = apps.findIndex(a => a.id === appId);
            if (index !== -1) {
                apps[index].status = status;
                localStorage.setItem('applications', JSON.stringify(apps));
                return apps[index];
            }
            return null;
        },
        
        // КУРСЫ
        getCourses: async function() {
            return JSON.parse(localStorage.getItem('courses'));
        },
        
        addCourse: function(data) {
            const courses = JSON.parse(localStorage.getItem('courses'));
            const newCourse = {...data, id: Date.now().toString(), createdAt: new Date().toISOString()};
            courses.push(newCourse);
            localStorage.setItem('courses', JSON.stringify(courses));
            return newCourse;
        },
        
        updateCourse: function(courseId, data) {
            const courses = JSON.parse(localStorage.getItem('courses'));
            const index = courses.findIndex(c => c.id === courseId);
            if (index !== -1) {
                courses[index] = {...courses[index], ...data};
                localStorage.setItem('courses', JSON.stringify(courses));
                return courses[index];
            }
            return null;
        },
        
        deleteCourse: function(courseId) {
            const courses = JSON.parse(localStorage.getItem('courses')).filter(c => c.id !== courseId);
            localStorage.setItem('courses', JSON.stringify(courses));
        },

        getFeedbacks: function() {
            return JSON.parse(localStorage.getItem('feedbacks') || '[]');
        },

        addFeedback: function(feedbackData) {
            const feedbacks = this.getFeedbacks();
            const newFeedback = {
                id: Date.now().toString(),
                ...feedbackData,
                status: 'pending', // pending, approved, rejected
                created: new Date().toISOString()
            };
            feedbacks.push(newFeedback);
            localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
            return newFeedback;
        },

        updateFeedbackStatus: function(feedbackId, status) {
            const feedbacks = this.getFeedbacks();
            const index = feedbacks.findIndex(f => f.id === feedbackId);
            if (index !== -1) {
                feedbacks[index].status = status;
                localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
                return feedbacks[index];
            }
            return null;
        },

        getApprovedFeedbacks: function() {
            return this.getFeedbacks().filter(f => f.status === 'approved');
        }
    };
    
    console.log('✅ PB System initialized');
})();