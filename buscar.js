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

app.get('/paciente', (req, res) => {
    connection.query('SELECT * FROM paciente', function (err, pacientes, fields) {
        if (err) {
            res.json({ erro: err.sqlMessage });
        } else {
            res.json(pacientes);
        }
    });
});
// Rota para buscar médicos e horários
app.get('/buscar-horarios', (req, res) => {
    const { nome, especialidade } = req.query;
  
    let query = 'SELECT Medico.Nome AS medico, Especialidade.Nome AS especialidade, Agendamento.Data, Agendamento.Horario ' +
                'FROM Medico ' +
                'JOIN Especialidade ON Medico.CodEspe = Especialidade.CodEspe ' +
                'JOIN Agendamento ON Medico.CRM = Agendamento.CRM_Medico ' +
                'WHERE 1 = 1';
  
    // Filtros de busca
    if (nome) {
      query += ` AND Medico.Nome LIKE '%${nome}%'`;
    }
    if (especialidade) {
      query += ` AND Especialidade.Nome = '${especialidade}'`;
    }
})
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