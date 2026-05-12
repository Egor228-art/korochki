class PocketBaseDB {
    constructor() {
        this.baseUrl = 'http://127.0.0.1:8090';
        this.pb = null;
    }

    async init() {
        if (typeof PocketBase === 'undefined') {
            await new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/pocketbase/dist/pocketbase.umd.js';
                script.onload = resolve;
                document.head.appendChild(script);
            });
        }
        
        this.pb = new PocketBase(this.baseUrl);
        console.log('PocketBase готов!');
    }

    // Простая регистрация
    async register(userData) {
        const user = await this.pb.collection('users').create(userData);
        await this.pb.collection('users').authWithPassword(userData.email, userData.password);
        return user;
    }

    // Простой вход
    async login(email, password) {
        const authData = await this.pb.collection('users').authWithPassword(email, password);
        return authData.record;
    }

    // Простой выход
    logout() {
        this.pb.authStore.clear();
    }

    // Проверка авторизации
    isLoggedIn() {
        return this.pb.authStore.isValid;
    }

    // Текущий пользователь
    getCurrentUser() {
        return this.pb.authStore.record;
    }

    // Получение заявок пользователя
    async getUserApplications() {
        try {
            console.log('🔄 Простой метод получения заявок...');
            
            const currentUser = this.getCurrentUser();
            if (!currentUser) return [];

            // Просто получаем все заявки
            const allApplications = await this.pb.collection('applications').getFullList();
            
            // Фильтруем на клиенте
            const userApplications = allApplications.filter(app => app.user === currentUser.id);
            
            return userApplications;
            
        } catch (error) {
            console.error('❌ Ошибка:', error);
            return [];
        }
    }

    // Создание заявки
    async createApplication(applicationData) {
        try {
            console.log('📝 Создание заявки:', applicationData);
            const record = await this.pb.collection('applications').create(applicationData);
            console.log('✅ Заявка создана:', record);
            return record;
        } catch (error) {
            console.error('❌ Ошибка создания заявки:', error);
            throw error;
        }
    }
}

window.pb = new PocketBaseDB();