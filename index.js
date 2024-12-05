const express = require('express')
const app     = express()
const port    = 3000
const mysql   = require('mysql');
const bp = require('body-parser')

app.use(bp.json())

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'agendamento'
});

app.listen(port, () => {
    console.log(`listening on port ${port}`)
    connection.connect(erro => {
        if (!erro) { console.log('BD conectado!') } 
        else { console.log('Erro na conexão ao BD' + erro.sqlMessage) }
    }) 
  })

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/produto', (req, res) => {
    connection.query('SELECT * FROM produto', 
      function(err, prods, fields) {
        if (err) {
            res.json({erro: err.sqlMessage})
        } else {
            res.json(prods)
        }
      });
})

app.get('/produto/:id', (req, res) => {
    const id = req.params.id
    connection.query('SELECT * FROM produto WHERE id=?', 
      [id], function(err, prods, fields) {
        if (err) {
            res.json({erro: err.sqlMessage})
        } else {
            res.json(prods)
        }
      });
})

app.post('/produto', (req, res) => {
  let produto = req.body

  console.log(produto)
});



