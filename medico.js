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

app.get('/medico', (req, res) => {
    connection.query('SELECT * FROM medico', function (err, medico, fields) {
        if (err) {
            res.json({ erro: err.sqlMessage });
        } else {
            res.json(medico);
        }
    });
});
// Rota para buscar dados dos médicos
app.get('/medico/:crm', (req, res) => {
    const crm = req.params.crm
    console.log(req.params.crm)
    connection.query('SELECT * FROM medico WHERE crm=?', 
      [crm], function(err, medico, fields) {
        if (err) {
            res.json({erro: err.sqlMessage})
        } else {
            res.json(medico)
        }
      });
})
// Rota para adicionar um médico //
app.post('/medico', (req, res) => {
    const { crm,nome,CodEsp } = req.body; 
    console.log(req.body)
    const sql = 'INSERT INTO medico (crm,nome,CodEsp) VALUES (?, ?, ?)'; 
    
    connection.query(sql, [crm,nome,CodEsp],
            (err, result) => {
                if (err) { res.json({ erro: err.sqlMessage }); }
                else {
                    res.json({ mensagem: 'Médico adicionado com sucesso', id: result.insertId });
                }
            })
})