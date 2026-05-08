const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    try {
        const sql = neon(process.env.POSTGRES_URL);
        
        // Таблицы
        await sql`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            full_name TEXT,
            phone TEXT,
            is_admin BOOLEAN DEFAULT false,
            created TIMESTAMP DEFAULT NOW()
        )`;
        
        await sql`CREATE TABLE IF NOT EXISTS courses (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            hours INTEGER,
            price INTEGER,
            level TEXT DEFAULT 'Начальный'
        )`;
        
        await sql`CREATE TABLE IF NOT EXISTS applications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            course_name TEXT,
            desired_start_date TEXT,
            payment_method TEXT,
            status TEXT DEFAULT 'Новая',
            created TIMESTAMP DEFAULT NOW()
        )`;
        
        await sql`CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
            review_text TEXT,
            created TIMESTAMP DEFAULT NOW()
        )`;
        
        // Админ
        const admin = await sql`SELECT id FROM users WHERE email = 'admin@korochki.est'`;
        if (admin.length === 0) {
            await sql`INSERT INTO users (email, password, full_name, phone, is_admin) 
                      VALUES ('admin@korochki.est', 'KorokNET', 'Администратор Системы', '8(000)000-00-00', true)`;
        }
        
        // Курсы
        const courses = await sql`SELECT id FROM courses LIMIT 1`;
        if (courses.length === 0) {
            await sql`INSERT INTO courses (name, hours, price, level) VALUES 
                ('Управление проектами', 72, 25000, 'Продвинутый'),
                ('Аналитика данных', 64, 22000, 'Начальный'),
                ('Кибербезопасность', 80, 30000, 'Средний'),
                ('HR-менеджмент', 56, 20000, 'Начальный'),
                ('Финансовый менеджмент', 72, 27000, 'Средний'),
                ('Digital-маркетинг', 60, 23000, 'Начальный')
            `;
        }
        
        res.json({ success: true, message: 'База данных готова!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};