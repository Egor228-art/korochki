const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') return res.status(200).end();

    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);

    try {
        if (req.method === 'GET') {
            const users = await sql`SELECT id, email, full_name, phone, is_admin FROM users`;
            return res.json({ users: users });
        }
        
        if (req.method === 'PATCH') {
            const urlParts = req.url.split('?')[0].split('/');
            const id = urlParts[urlParts.length - 1];
            
            if (password) {
                const result = await sql`
                    UPDATE users 
                    SET full_name = ${full_name}, phone = ${phone}, password = ${password}
                    WHERE id = ${id}
                    RETURNING id, email, full_name, phone, is_admin
                `;
                return res.json(result[0]);
            }
            
            const result = await sql`
                UPDATE users 
                SET full_name = ${full_name}, phone = ${phone}
                WHERE id = ${id}
                RETURNING id, email, full_name, phone, is_admin
            `;
            return res.json(result[0]);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};