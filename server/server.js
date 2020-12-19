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
  try {
    var sql =
      "SELECT c.id, c.name,c.cpf,c.street,c.home_num,c.district,(SELECT SUM(p.balance) FROM payments AS p WHERE p.client_id = c.id) AS balance FROM clients AS c LEFT JOIN payments AS p ON c.id = p.client_id WHERE DATE(p.payday + interval'1'DAY*p.deadline) <= DATE(now()) GROUP BY c.id ORDER BY (SELECT p.payday FROM payments AS p WHERE c.id = p.client_id ORDER BY p.payday DESC LIMIT 1) + interval'1'DAY*(SELECT p.deadline FROM payments AS p WHERE c.id = p.client_id ORDER BY p.payday DESC LIMIT 1) DESC";
    pool.query(sql).then((response) => {
      res.status(201).json(response.rows);
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/registerClient', (req, res) => {
  // console.log(req.body);
  try {
    const { client, payment } = req.body;
    var sql_client =
      'INSERT INTO clients (name, cpf, street, home_num, district, cep, telephone, job) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id';
    var sql_payment =
      'INSERT INTO payments (client_id, balance, payday, deadline) VALUES ($1, $2, $3, $4) ';
    var values_client = [
      client.name,
      client.cpf,
      client.street,
      client.home_num,
      client.district,
      client.cep,
      client.telephone,
      client.job,
    ];
    pool
      .query(sql_client, values_client)
      .then((res) => {
        var values_payments = [
          res.rows[0].id,
          payment.balance,
          payment.payday,
          payment.deadline,
        ];
        pool
          .query(sql_payment, values_payments)
          .then((res) => console.log(res.rows[0]))
          .catch((e) => console.error(e.stack));
      })
      .catch((e) => console.error(e.stack));
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/profile', (req, res) => {
  try {
    const { id } = req.body;
    var sql =
      "SELECT c.id, c.name, c.street, c.home_num,c.district,c.job,c.cpf,c.cep,c.telephone, (SELECT SUM(balance) FROM payments AS p WHERE p.client_id = c.id) AS balance,(SELECT p.payday FROM payments AS p WHERE c.id = p.client_id ORDER BY p.payday DESC LIMIT 1),(SELECT p.deadline FROM payments AS p WHERE c.id = p.client_id ORDER BY p.payday DESC LIMIT 1) FROM clients AS c LEFT JOIN payments AS p ON c.id = p.client_id WHERE c.id = $1 GROUP BY c.id ORDER BY (SELECT p.payday FROM payments AS p WHERE c.id = p.client_id ORDER BY p.payday DESC LIMIT 1) + interval '1' DAY*(SELECT p.deadline FROM payments AS p WHERE c.id = p.client_id ORDER BY p.payday DESC LIMIT 1) DESC";
    var values = [id];
    pool.query(sql, values).then((re) => {
      res.status(201).json(re.rows[0]);
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/profile/edit', (req, res) => {
  console.log(req.body);
  try {
    const { client } = req.body;
    var sql =
      'INSERT INTO clients (name, cpf, street, home_num, district, cep, telephone, job) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id';
    var values = [
      client.name,
      client.cpf,
      client.street,
      client.home_num,
      client.district,
      client.cep,
      client.telephone,
      client.job,
    ];
    pool
      .query(sql, values)
      .then((res) => console.log(res.rows[0]))
      .catch((e) => console.error(e.stack));
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/getSearch', (req, res) => {
  try {
    const { search, index } = req.body;
    switch (index) {
      case 1:
        var sql =
          "SELECT DISTINCT c.id, c.name,c.cpf,c.street,c.home_num,c.district,(SELECT SUM(p.balance) FROM payments AS p WHERE p.client_id = c.id) AS balance FROM clients AS c LEFT JOIN payments AS p ON c.id = p.client_id WHERE c.cpf LIKE '%'||$1||'%'";
        var values = [search];

        pool.query(sql, values).then((response) => {
          res.status(201).json(response.rows);
        });

        break;
      case 2:
        var sql =
          "SELECT DISTINCT c.id, c.name,c.cpf,c.street,c.home_num,c.district,(SELECT SUM(p.balance) FROM payments AS p WHERE p.client_id = c.id) AS balance FROM clients AS c LEFT JOIN payments AS p ON c.id = p.client_id WHERE c.name LIKE '%' ||$1||'%' ORDER BY c.name";
        var values = [search];

        pool.query(sql, values).then((response) => {
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

app.post('/addPayment', (req, res) => {
  console.log(req.body);
  try {
    const { client_id, payment } = req.body;
    var sql =
      'INSERT INTO payments ( client_id, balance, payday, deadline) VALUES ($1, $2, $3, $4)';
    var values = [client_id, payment.balance, payment.payday, payment.deadline];
    pool
      .query(sql, values)
      .then((res) => console.log(res.rows[0]))
      .catch((e) => console.error(e.stack));
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
