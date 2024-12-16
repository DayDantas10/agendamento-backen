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
// Rota para adicionar um paciente //
app.post('/paciente', (req, res) => {
    const { nome, cpf, email } = req.body; 
    console.log(req.body)
    const sql = 'INSERT INTO paciente (nome, cpf, email) VALUES (?, ?, ?)'; 
    
    connection.query(sql, [nome, cpf, email],
            (err, result) => {
                if (err) { res.json({ erro: err.sqlMessage }); }
                else {
                    res.json({ mensagem: 'Paciente adicionado com sucesso', id: result.insertId });
                }
            })
})
app.get('/medico', (req, res) => {
    connection.query('SELECT * FROM medico', function (err, medico, fields) {
        if (err) {
            res.json({ erro: err.sqlMessage });
        } else {
            res.json(medico);
        }
    });
});

