const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') return res.status(200).end();

    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);

    try {
        if (req.method === 'GET') {
            const courses = await sql`SELECT * FROM courses ORDER BY name`;
            return res.json({ items: courses });
        }
        
        if (req.method === 'POST') {
            const { name, hours, price, level } = req.body;
            const result = await sql`
                INSERT INTO courses (name, hours, price, level)
                VALUES (${name}, ${hours}, ${price}, ${level})
                RETURNING *
            `;
            return res.json(result[0]);
        }
        
        if (req.method === 'DELETE') {
            const id = req.url.split('/').pop();
            await sql`DELETE FROM courses WHERE id = ${id}`;
            return res.json({ success: true });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};