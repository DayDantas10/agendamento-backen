const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql');
const cors = require('cors')
const bp = require('body-parser')
app.use(cors())
app.use(bp.json())

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



app.get('/especialidade/', (req, res) => {
    connection.query('SELECT * FROM especialidade', function (err, especialidade, fields) {
        if (err) {
            res.json({ erro: err.sqlMessage });
        } else {
            res.json(especialidade);
        }
    });
});

// Rota para adicionar a especialidade //
app.post('/especialidade', (req, res) => {
    const { CodEspe,nome } = req.body; 
    console.log(req.body)
    const sql = 'INSERT INTO especialidade (CodEspe,nome) VALUES (?, ?)'; 
    
    connection.query(sql, [CodEspe,nome],
            (err, result) => {
                if (err) { res.json({ erro: err.sqlMessage }); }
                else {
                    res.json({ mensagem: 'Especialidade adicionada com sucesso', id: result.insertId });
                }
            });
});