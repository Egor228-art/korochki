const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') return res.status(200).end();

    const sql = neon(process.env.DATABASE_URL);

    try {
        if (req.method === 'GET') {
            const url = new URL(req.url, 'http://localhost');
            const userId = url.searchParams.get('user');
            
            let applications;
            if (userId) {
                applications = await sql`
                    SELECT a.*, u.full_name as user_name, u.email as user_email
                    FROM applications a
                    JOIN users u ON a.user_id = u.id
                    WHERE a.user_id = ${userId}
                    ORDER BY a.created DESC
                `;
            } else {
                applications = await sql`
                    SELECT a.*, u.full_name as user_name, u.email as user_email
                    FROM applications a
                    JOIN users u ON a.user_id = u.id
                    ORDER BY a.created DESC
                `;
            }
            return res.json({ items: applications });
        }
        
        if (req.method === 'POST') {
            const { user_id, course_name, desired_start_date, payment_method } = req.body;
            const result = await sql`
                INSERT INTO applications (user_id, course_name, desired_start_date, payment_method, status)
                VALUES (${user_id}, ${course_name}, ${desired_start_date}, ${payment_method}, 'Новая')
                RETURNING *
            `;
            return res.json(result[0]);
        }
        
        if (req.method === 'PATCH') {
            const id = req.url.split('/').pop();
            const { status } = req.body;
            const result = await sql`
                UPDATE applications SET status = ${status} WHERE id = ${id}
                RETURNING *
            `;
            return res.json(result[0]);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};