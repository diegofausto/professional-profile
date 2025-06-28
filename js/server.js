require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do pool de conexões
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false // Necessário para conexão com Neon
    }
});

// Rota para salvar contatos
app.post('/api/contacts', async (req, res) => {
    const { name, whatsapp, email, message } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO contacts (name, whatsapp, email, message) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, whatsapp, email, message]
        );
        
        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao salvar contato'
        });
    }
});

// Rota de teste
app.get('/', (req, res) => {
    res.send('API funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});