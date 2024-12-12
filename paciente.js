const express = require('express')
const app     = express()
const port    = 3000
const mysql   = require('mysql');
const bp = require('body-parser')

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clinica'
});

// Conectar ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
        return;
    }
    console.log('Conectado ao banco de dados.');
});

// Rota para buscar dados dos pacientes
app.get('/pacientes', (req, res) => {
    connection.query('SELECT * FROM pacientes', function(err, pacientes, fields) {
        if (err) {
            res.json({erro: err.sqlMessage});
        } else {
            res.json(pacientes);
        }
    });
});

// Rota para adicionar um paciente //
app.post('/paciente', (req, res) => { const { nome, cpf, email } = req.body; const sql 
= 'INSERT INTO pacientes (nome, cpf, email) VALUES (?, ?, ?)'; connection.query(sql, [nome, cpf, email],
     (err, result) => { if (err) { res.json({ erro: err.sqlMessage }); }
      else { res.json({ mensagem: 'Paciente adicionado com sucesso', id: result.insertId }); 
    }
})
})
// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000.');
});
