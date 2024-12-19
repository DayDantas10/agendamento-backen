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
  database: 'clinica2'
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

app.get('/especialidade', (req, res) => {
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
  const { CodEspe, nome } = req.body;
  console.log(req.body)
  const sql = 'INSERT INTO especialidade (CodEspe,nome) VALUES (?, ?)';

  connection.query(sql, [CodEspe, nome],
    (err, result) => {
      if (err) { res.json({ erro: err.sqlMessage }); }
      else {
        res.json({ mensagem: 'Especialidade adicionada com sucesso', id: result.insertId });
      }
    });
});

// Rota para listar médicos
app.get('/listarespecialidades', (req, res) => {
  connection.query('SELECT * FROM especialidade', (err, medico, fields) => {
    if (err) {
      console.log('Erro ao consultar especialidades:', err); // Para depuração
      return res.status(500).json({ erro: err.sqlMessage });
    } else {
      res.json(especialidade);
    }
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
app.get('/listarmedicos', (req, res) => {
  connection.query('SELECT * FROM medico', (err, medico, fields) => {
    if (err) {
      console.log('Erro ao consultar médicos:', err); // Para depuração
      return res.status(500).json({ erro: err.sqlMessage });
    } else {
      res.json(medico);
    }
  });
});

// Rota para listar médicos
app.get('/listarmedicosporespecialidade/:CodEspe', (req, res) => {
  let codEspe = req.params.CodEspe;
  connection.query(`SELECT * FROM medico where CodEspe = ${codEspe}`, (err, medico, fields) => {
    if (err) {
      console.log('Erro ao consultar médicos:', err); // Para depuração
      return res.status(500).json({ erro: err.sqlMessage });
    } else {
      res.json(medico);
    }
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
// Rota para buscar dados dos pacientes
app.get('/paciente/:cpf', (req, res) => {
  const cpf = req.params.cpf
  console.log(req.params.cpf)
  connection.query('SELECT * FROM paciente WHERE cpf=?',
    [cpf], function (err, paciente, fields) {
      if (err) {
        res.json({ erro: err.sqlMessage })
      } else {
        res.json(paciente)
      }
    });
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
  // Exemplo usando Node.js com MySQL
  connection.query(`
SELECT h.id, h.horario, h.data_agendamento, h.disponivel, m.nome 
FROM Horarios h
JOIN Medico m ON h.medico_id = m.CRM
WHERE h.disponivel = TRUE;
`, (err, resultados) => {
    if (err) {
      console.log('Erro ao consultar horários:', err);
      return res.status(500).json({ erro: err.sqlMessage });
    } else {
      res.json(resultados);
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

app.get('/agendamentos', (req, res) => {
  const { crm, data } = req.query;
  const query = "SELECT * FROM horarios WHERE crm_medico = ? AND data_hora LIKE ? AND disponivel = true";
  db.query(query, [crm, `${data}%`], (err, results) => {
      if (err) throw err;
      res.json(results);
  });
});

// Endpoint para agendar consulta
app.post('/agendar', (req, res) => {
  const { cpf, crm, data} = req.body;

  // Remover horário da lista de disponíveis
  const updateQuery = "UPDATE horarios SET disponivel = false WHERE crm_medico = ? AND data_hora = ?";
  db.query(updateQuery, [crm, data], (err, result) => {
      if (err) throw err;

      // Inserir a consulta na tabela de consultas
      const insertQuery = "INSERT INTO agendamento_consulta (cpf_paciente, crm_medico, data_hora) VALUES (?, ?, ?)";
      db.query(insertQuery, [cpf, crm, data], (err, result) => {
          if (err) throw err;
          res.json({ message: 'Consulta agendada com sucesso!' });
      });
  });
});