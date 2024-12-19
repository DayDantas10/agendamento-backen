const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senha',
    database: 'clinica'
});

// Conectar ao banco
db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao banco de dados');
});

// Endpoint para buscar médicos por especialidade ou nome
app.get('/medicos', (req, res) => {
    const { nome, especialidade } = req.params;
    let query = "SELECT * FROM medicos WHERE 1=1";
    if (nome) query += ` AND nome LIKE '%${nome}%'`;
    if (especialidade) query += ` AND especialidade LIKE '%${especialidade}%'`;

    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Endpoint para buscar horários disponíveis de um médico
app.get('/horarios', (req, res) => {
    const { crm, data } = req.query;
    const query = "SELECT * FROM horarios_disponiveis WHERE crm_medico = ? AND data_hora LIKE ? AND disponivel = true";
    db.query(query, [crm, `${data}%`], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Endpoint para agendar consulta
app.post('/agendar', (req, res) => {
    const { cpf, crm, data_hora } = req.body;

    // Remover horário da lista de disponíveis
    const updateQuery = "UPDATE horarios_disponiveis SET disponivel = false WHERE crm_medico = ? AND data_hora = ?";
    db.query(updateQuery, [crm, data_hora], (err, result) => {
        if (err) throw err;

        // Inserir a consulta na tabela de consultas
        const insertQuery = "INSERT INTO consultas (cpf_paciente, crm_medico, data_hora) VALUES (?, ?, ?)";
        db.query(insertQuery, [cpf, crm, data_hora], (err, result) => {
            if (err) throw err;
            res.json({ message: 'Consulta agendada com sucesso!' });
        });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
