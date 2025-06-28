const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.NEON_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, whatsapp, email, message } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO contacts (name, whatsapp, email, message) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, whatsapp, email, message]
        );
        
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Erro ao salvar contato' });
    }
};