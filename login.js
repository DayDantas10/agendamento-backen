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

// Rota para realização de login
router.post('/login', async (req, res) => {
  // Obtenha usuário e senha do corpo da requisição
  const { atendente, senha } = req.body;

  // Aqui, seria necessário buscar o usuário do banco de dados  
  const atendenteBanco = {
    cpf : "",
    senha : ""
  }

  // Verifique a senha
  if (senha === atendenteBanco.senha){
    const token = jwt.sign({ cpf: atendenteBanco.cpf }, 'Acesso liberado', { expiresIn: '1h' });
    res.json({ token });
  } else {
    // Senha incorreta
    res.status(401).json({erro : "Acesso negado"});
  }
});

module.exports = router;
