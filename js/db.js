// IndexedDB работа

let dbInstance = null;

function openDB() {
    return new Promise((resolve, reject) => {
        if (dbInstance && dbInstance.name === 'KorochkiDB') {
            resolve(dbInstance);
            return;
        }
        
        const request = indexedDB.open('KorochkiDB', 5);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            dbInstance = request.result;
            resolve(dbInstance);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Таблица users
            if (!db.objectStoreNames.contains('users')) {
                const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                userStore.createIndex('login', 'login', { unique: true });
            }
            
            // Таблица applications
            if (!db.objectStoreNames.contains('applications')) {
                const appStore = db.createObjectStore('applications', { keyPath: 'id', autoIncrement: true });
                appStore.createIndex('user_id', 'user_id');
            }
            
            // Таблица reviews
            if (!db.objectStoreNames.contains('reviews')) {
                const reviewStore = db.createObjectStore('reviews', { keyPath: 'id', autoIncrement: true });
                reviewStore.createIndex('application_id', 'application_id', { unique: true });
            }
            
            // НОВАЯ ТАБЛИЦА: курсы
            if (!db.objectStoreNames.contains('courses')) {
                const courseStore = db.createObjectStore('courses', { keyPath: 'id', autoIncrement: true });
                courseStore.createIndex('name', 'name');
            }
        };
    });
}

// ========== USERS ==========
async function addUser(user) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('users', 'readwrite');
        const store = tx.objectStore('users');
        const request = store.add(user);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getUserByLogin(login) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('users', 'readonly');
        const store = tx.objectStore('users');
        const index = store.index('login');
        const request = index.get(login);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getAllUsers() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('users', 'readonly');
        const store = tx.objectStore('users');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function updateUser(user) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('users', 'readwrite');
        const store = tx.objectStore('users');
        const request = store.put(user);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

async function deleteUser(userId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('users', 'readwrite');
        const store = tx.objectStore('users');
        const request = store.delete(userId);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

// ========== APPLICATIONS ==========
async function addApplication(app) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('applications', 'readwrite');
        const store = tx.objectStore('applications');
        const request = store.add(app);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getApplicationsByUser(userId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('applications', 'readonly');
        const store = tx.objectStore('applications');
        const index = store.index('user_id');
        const request = index.getAll(userId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getAllApplications() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('applications', 'readonly');
        const store = tx.objectStore('applications');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function updateApplicationStatus(id, status) {
    const apps = await getAllApplications();
    const app = apps.find(a => a.id === id);
    if (!app) return false;
    app.status = status;
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('applications', 'readwrite');
        const store = tx.objectStore('applications');
        const request = store.put(app);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

// ========== REVIEWS ==========
async function addReview(review) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('reviews', 'readwrite');
        const store = tx.objectStore('reviews');
        const request = store.add(review);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getReviewByApplicationId(appId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('reviews', 'readonly');
        const store = tx.objectStore('reviews');
        const index = store.index('application_id');
        const request = index.get(appId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// ========== COURSES (НОВЫЕ) ==========
async function addCourse(course) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('courses', 'readwrite');
        const store = tx.objectStore('courses');
        const request = store.add(course);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getAllCourses() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('courses', 'readonly');
        const store = tx.objectStore('courses');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function updateCourse(course) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('courses', 'readwrite');
        const store = tx.objectStore('courses');
        const request = store.put(course);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

async function deleteCourse(courseId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('courses', 'readwrite');
        const store = tx.objectStore('courses');
        const request = store.delete(courseId);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
async function initAdmin() {
    const admin = await getUserByLogin('Admin');
    if (!admin) {
        const hashedPass = await hashPassword('KorokNET');
        await addUser({
            login: 'Admin',
            password: hashedPass,
            full_name: 'Администратор Системы',
            phone: '8(000)000-00-00',
            email: 'admin@korochki.est',
            is_admin: 1
        });
    }
}

async function initCourses() {
    const courses = await getAllCourses();
    if (courses.length === 0) {
        const defaultCourses = [
            { name: 'Управление проектами', hours: 72, price: 25000, level: 'Продвинутый' },
            { name: 'Аналитика данных', hours: 64, price: 22000, level: 'Начальный' },
            { name: 'Кибербезопасность', hours: 80, price: 30000, level: 'Средний' },
            { name: 'HR-менеджмент', hours: 56, price: 20000, level: 'Начальный' },
            { name: 'Финансовый менеджмент', hours: 72, price: 27000, level: 'Средний' },
            { name: 'Digital-маркетинг', hours: 60, price: 23000, level: 'Начальный' }
        ];
        for (let course of defaultCourses) {
            await addCourse(course);
        }
    }
}