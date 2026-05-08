const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
    const { email, password } = req.body;

    try {
        const users = await sql`
            SELECT id, email, full_name, phone, is_admin 
            FROM users 
            WHERE email = ${email} AND password = ${password}
        `;
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        res.json({ user: users[0], token: users[0].id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};