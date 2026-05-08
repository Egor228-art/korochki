const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
    const { email, password, full_name, phone } = req.body;

    try {
        const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email уже зарегистрирован' });
        }

        const result = await sql`
            INSERT INTO users (email, password, full_name, phone, is_admin)
            VALUES (${email}, ${password}, ${full_name}, ${phone}, false)
            RETURNING id, email, full_name, phone, is_admin
        `;
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};