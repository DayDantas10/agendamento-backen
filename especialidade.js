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

// Rota para adicionar a especialidade //
app.post('/especialidade', (req, res) => {
    const { CodEspe, nome } = req.body;
  
    // Validar dados antes de inserir
    if (!nome) {
      return res.status(400).send('Nome da especialidade é obrigatório');
    }
  
    const query = 'INSERT INTO Especialidade (CodEspe, nome) VALUES (?, ?)';
    db.query(query, [CodEspe, nome], (err, result) => {
      if (err) {
        console.error('Erro ao inserir especialidade:', err);
        return res.status(500).send('Erro ao adicionar especialidade');
      }
      res.status(201).send('Especialidade adicionada com sucesso');
    });
  });
  

// Rota para buscar a especialidade //
app.get('/especialidade/', (req, res) => {
    connection.query('SELECT * FROM especialidade', function (err, especialidade, fields) {
        if (err) {
            res.json({ erro: err.sqlMessage });
        } else {
            res.json(especialidade);
        }
    });
});