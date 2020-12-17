const express = require('express');
const cors = require('cors');
const app = express();
const BodyParser = require('body-parser');
const pool = require('./db');
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

//Rotas
app.get('/ping', (req, res) => {
  res.send('Pong');
});

app.post('/list', (req, res) => {
  try{
    pool.query("SELECT c.id, c.name,c.cpf,c.street,c.home_num,c.district,(SELECT SUM(p.balance) FROM payments AS p WHERE p.client_id = c.id) AS balance FROM clients AS c LEFT JOIN payments AS p ON c.id = p.client_id WHERE DATE(p.payday + interval'1'DAY*p.deadline) <= DATE(now()) GROUP BY c.id ORDER BY (SELECT p.payday FROM payments AS p WHERE c.id = p.client_id ORDER BY p.payday DESC LIMIT 1) + interval'1'DAY*(SELECT p.deadline FROM payments AS p WHERE c.id = p.client_id ORDER BY p.payday DESC LIMIT 1) DESC").then((response) => {
      res.status(201).json(response.rows);
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/registerClient', (req, res) => {
  console.log(req.body);
  try {
    const { client, payment } = req.body;
    pool
      .query(
        'INSERT INTO clients (name, cpf, street, home_num, district, cep, telephone, job) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [
          client.name,
          client.cpf,
          client.street,
          client.home_num,
          client.district,
          client.cep,
          client.telephone,
          client.job,
        ]
      )
      .then((res) => console.log(res.rows[0]))
      .catch((e) => console.error(e.stack));
    pool.query('SELECT * FROM clients').then((res) => console.log(res.rows[0]));
    console.log(select);
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/profile', (req, res) => {
  try {
    const { id } = req.body;
    pool
      .query(
        "SELECT c.id, c.name, c.street, c.home_num,c.district,c.job,c.cpf,c.cep,c.telephone, (SELECT SUM(balance) FROM payments AS p WHERE p.client_id = c.id) AS balance,(SELECT p.payday FROM payments AS p WHERE c.id = p.client_id ORDER BY p.payday DESC LIMIT 1),(SELECT p.deadline FROM payments AS p WHERE c.id = p.client_id ORDER BY p.payday DESC LIMIT 1) FROM clients AS c LEFT JOIN payments AS p ON c.id = p.client_id WHERE c.id = $1 GROUP BY c.id ORDER BY (SELECT p.payday FROM payments AS p WHERE c.id = p.client_id ORDER BY p.payday DESC LIMIT 1) + interval '1' DAY*(SELECT p.deadline FROM payments AS p WHERE c.id = p.client_id ORDER BY p.payday DESC LIMIT 1) DESC",
        [id]
      )
      .then((re) => {
        res.status(201).json(re.rows[0]);
      });
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/profile/edit', (req, res) => {
  try{
    console.log(req.body);
  }catch (err) {
    console.error(err.message);
  }
});

app.post('/getSearch',  (req, res) => {
  
  try{
    const { search , index } = req.body;
    switch(index){
      case 1:
        var sql = "SELECT DISTINCT c.id, c.name,c.cpf,c.street,c.home_num,c.district,(SELECT SUM(p.balance) FROM payments AS p WHERE p.client_id = c.id) AS balance FROM clients AS c LEFT JOIN payments AS p ON c.id = p.client_id WHERE c.cpf LIKE '%'||$1||'%'"
        var values = [search]

        pool.query(sql,values).then((response) => {
          res.status(201).json(response.rows);
        });

        break;
      case 2:
        var sql = "SELECT DISTINCT c.id, c.name,c.cpf,c.street,c.home_num,c.district,(SELECT SUM(p.balance) FROM payments AS p WHERE p.client_id = c.id) AS balance FROM clients AS c LEFT JOIN payments AS p ON c.id = p.client_id WHERE c.name LIKE '%' ||$1||'%' ORDER BY c.name"
        var values = [search]

        pool.query(sql,values).then((response) => {
          res.status(201).json(response.rows);
        });

        break;
      case 3: 
        break;
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/addPayment',  (req, res) => {
  try{
    const { id, balance, deadline } = res.body;
    pool.query('INSERT INTO clients (client_id,balance,deadline) VALUES ($1,$2,$3)',[id,balance,]).then(response=>{console.log(response.rows)})
  }catch (err) {
    console.error(err.message);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));