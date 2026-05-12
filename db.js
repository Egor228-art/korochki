// db.js - Универсальный модуль для работы с данными
class Database {
    constructor() {
        this.tables = {
            users: 'users',
            courses: 'courses',
            applications: 'applications'
        };
        this.init();
    }

    // Инициализация базы данных
    init() {
        if (!this.get('users')) {
            this.set('users', [
                {
                    id: 1,
                    username: 'Admin',
                    email: 'admin@example.com',
                    password: 'KorokNET',
                    fullName: 'Администратор Системы',
                    phone: '+79999999999',
                    role: 'admin',
                    createdAt: new Date().toISOString()
                }
            ]);
        }

        if (!this.get('courses')) {
            this.set('courses', [
                {
                    id: 1,
                    name: 'Веб-разработка с нуля',
                    description: 'Полный курс по созданию современных веб-сайтов',
                    price: 15000,
                    duration: '3 месяца',
                    category: 'Программирование',
                    image: '🖥️',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Дизайн интерфейсов UX/UI',
                    description: 'Проектирование и дизайн пользовательских интерфейсов',
                    price: 12000,
                    duration: '2 месяца',
                    category: 'Дизайн',
                    image: '🎨',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'Digital-маркетинг',
                    description: 'Стратегии продвижения в цифровой среде',
                    price: 10000,
                    duration: '2 месяца',
                    category: 'Маркетинг',
                    image: '📊',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    name: 'Мобильная разработка',
                    description: 'Создание приложений для iOS и Android',
                    price: 18000,
                    duration: '4 месяца',
                    category: 'Программирование',
                    image: '📱',
                    createdAt: new Date().toISOString()
                }
            ]);
        }

        if (!this.get('applications')) {
            this.set('applications', []);
        }
    }

    // Базовые методы
    get(table) {
        const data = localStorage.getItem(table);
        return data ? JSON.parse(data) : [];
    }

    set(table, data) {
        localStorage.setItem(table, JSON.stringify(data));
        return true;
    }

    // CRUD операции
    insert(table, data) {
        const currentData = this.get(table);
        data.id = this.generateId();
        data.createdAt = new Date().toISOString();
        currentData.push(data);
        this.set(table, currentData);
        return data;
    }

    select(table, conditions = {}) {
        const data = this.get(table);
        if (Object.keys(conditions).length === 0) {
            return data;
        }
        
        return data.filter(item => {
            for (let key in conditions) {
                if (item[key] !== conditions[key]) {
                    return false;
                }
            }
            return true;
        });
    }

    findOne(table, conditions) {
        const results = this.select(table, conditions);
        return results.length > 0 ? results[0] : null;
    }

    update(table, id, updates) {
        const data = this.get(table);
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
            this.set(table, data);
            return data[index];
        }
        return null;
    }

    delete(table, id) {
        const data = this.get(table);
        const filteredData = data.filter(item => item.id !== id);
        this.set(table, filteredData);
        return true;
    }

    generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }
}

// Создаем глобальный экземпляр БД
window.db = new Database();