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

// Rota para adicionar horário
app.post('/horarios', (req, res) => {
    const { medico_id, horario, disponivel } = req.body;
  
    // Verificando se os campos obrigatórios estão presentes
    if (!medico_id || !horario) {
      return res.status(400).json({ erro: 'Medico_id e horário são obrigatórios.' });
    }
  
    // SQL para inserir o novo horário
    const sql = 'INSERT INTO Horarios (medico_id, horario, disponivel) VALUES (?, ?, ?)';
    connection.query(sql, [medico_id, horario, disponivel], (err, result) => {
      if (err) {
        console.log('Erro ao inserir horário:', err);
        return res.status(500).json({ erro: 'Erro ao cadastrar horário', detalhe: err.sqlMessage });
      }
  
      res.json({ mensagem: 'Horário cadastrado com sucesso', id: result.insertId });
    });
  });
  

// Rota para listar horários
app.get('/horario', (req, res) => {
    connection.query('SELECT * FROM horarios', (err, horarios, fields) => {
        if (err) {
            console.log('Erro ao consultar horários:', err); // Para depuração
            return res.status(500).json({ erro: err.sqlMessage });
        } else {
            res.json(horarios);
        }
    });
});

// Rota para listar horários de um médico específico
app.get('/horario/:medico_id', (req, res) => {
    const medico_id = req.params.medico_id;
    const sql = 'SELECT * FROM horarios WHERE medico_id = ?';

    connection.query(sql, [medico_id], (err, horarios, fields) => {
        if (err) {
            console.log('Erro ao consultar horários do médico:', err); // Para depuração
            return res.status(500).json({ erro: err.sqlMessage });
        } else {
            res.json(horarios);
        }
    });
});

// Rota para editar horário
app.put('/horario/:id', (req, res) => {
    const id = req.params.id;
    const { medico_id, horario, disponivel } = req.body;

    // Verificar se os dados para editar foram fornecidos
    if (!medico_id || !horario) {
        return res.status(400).json({ erro: 'Medico_id e horário são obrigatórios para editar.' });
    }

    const sql = 'UPDATE horarios SET medico_id = ?, horario = ?, disponivel = ? WHERE id = ?';

    connection.query(sql, [medico_id, horario, disponivel, id], (err, result) => {
        if (err) {
            console.log('Erro ao editar horário:', err); // Para depuração
            return res.status(500).json({ erro: 'Erro ao editar horário', detalhe: err.sqlMessage });
        } else {
            res.json({ mensagem: 'Horário editado com sucesso' });
        }
    });
});

// Rota para excluir horário
app.delete('/horario/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM horarios WHERE id = ?';

    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Erro ao excluir horário:', err); // Para depuração
            return res.status(500).json({ erro: 'Erro ao excluir horário', detalhe: err.sqlMessage });
        } else {
            res.json({ mensagem: 'Horário excluído com sucesso' });
        }
    });
});

// Rota para buscar horários disponíveis
app.get('/horarios/disponiveis', (req, res) => {
    const sql = 'SELECT * FROM horarios WHERE disponivel = TRUE';

    connection.query(sql, (err, horarios, fields) => {
        if (err) {
            console.log('Erro ao buscar horários disponíveis:', err); // Para depuração
            return res.status(500).json({ erro: err.sqlMessage });
        } else {
            res.json(horarios);
        }
    });
});
