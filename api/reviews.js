const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') return res.status(200).end();

    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);

    try {
        if (req.method === 'GET') {
            const url = new URL(req.url, 'http://localhost');
            const applicationId = url.searchParams.get('application');
            
            if (applicationId) {
                const reviews = await sql`SELECT * FROM reviews WHERE application_id = ${applicationId}`;
                return res.json({ items: reviews });
            }
            
            const reviews = await sql`
                SELECT r.*, u.full_name as user_name, a.course_name
                FROM reviews r
                JOIN users u ON r.user_id = u.id
                JOIN applications a ON r.application_id = a.id
                ORDER BY r.created DESC
            `;
            return res.json({ items: reviews });
        }
        
        if (req.method === 'POST') {
            const { user_id, application_id, review_text } = req.body;
            const result = await sql`
                INSERT INTO reviews (user_id, application_id, review_text)
                VALUES (${user_id}, ${application_id}, ${review_text})
                RETURNING *
            `;
            return res.json(result[0]);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};