// js/init.js - Инициализация данных при первом запуске
(function() {
    // Добавляем админа, если нет пользователей
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
        users.push({
            id: '1',
            email: 'admin@example.com',
            password: 'KorokNET',
            FIO: 'Администратор Системы',
            name: 'Admin',
            telephone: '+79999999999',
            role: 'admin',
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
})();