const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
const cors = require('cors');
const bp = require('body-parser');

app.use(cors());
app.use(bp.json()); // Middleware para processar JSON no corpo da requisição

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clinica'
});

// Iniciar o servidor
app.listen(port, () => {
    console.log('Servidor rodando na porta 3000.');
    // Conectar ao banco de dados
    connection.connect((err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err.stack);
            return;
        }
        console.log('Conectado ao banco de dados.');
    });
});

// Rota para adicionar um médico
app.post('/medico', (req, res) => {
    const { CRM, nome, CodEspe } = req.body;
    
    // Verificar se todos os campos foram enviados
    if (!CRM || !nome || !CodEspe) {
        return res.status(400).json({ erro: 'CRM, nome e CodEspe são obrigatórios.' });
    }
    
    console.log('Recebendo dados do corpo da requisição:', req.body);  // Para depuração

    // SQL para inserir os dados na tabela 'medico'
    const sql = 'INSERT INTO medico(CRM, nome, CodEspe) VALUES (?, ?, ?)'; 
    
    connection.query(sql, [CRM, nome, CodEspe], (err, result) => {
        if (err) {
            console.log('Erro ao inserir médico:', err); // Para depuração
            return res.status(500).json({ erro: 'Erro ao inserir médico', detalhe: err.sqlMessage });
        } else {
            // Retornando a mensagem com o ID inserido
            res.json({ mensagem: 'Médico adicionado com sucesso', CRM: result.insertId });
        }
    });
});

// Rota para listar médicos
app.get('/medico', (req, res) => {
    connection.query('SELECT * FROM medico', (err, medico, fields) => {
        if (err) {
            console.log('Erro ao consultar médicos:', err); // Para depuração
            return res.status(500).json({ erro: err.sqlMessage });
        } else {
            res.json(medico);
        }
    });
});

