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
    // var sql = `SELECT idk.id, idk.name, idk.street, idk.home_num, idk.district, idk.payday,idk.due_date, idk.balance FROM
    //           (SELECT DISTINCT ON (c.id) c.id, c.name, c.street, c.home_num, c.district, p.payday, p.payday + interval '1' DAY * p.deadline AS due_date,
    //           (SELECT SUM(p.balance) FROM payments AS p WHERE p.client_id = c.id) AS balance FROM payments AS p
    //           INNER JOIN clients AS c ON (p.client_id = c.id)

    //           ORDER BY c.id ,due_date DESC) AS idk ORDER BY due_date DESC`;

    var sql = `SELECT idk.id, idk.name, idk.street, idk.home_num, idk.district, idk.payday,idk.due_date, idk.balance FROM 
      (SELECT DISTINCT ON (c.id) c.id, c.name, c.street, c.home_num, c.district, p.payday, p.payday + interval '1' DAY * p.deadline AS due_date, 
      (SELECT SUM(p.balance) FROM payments AS p WHERE p.client_id = c.id) AS balance FROM payments AS p 
      INNER JOIN clients AS c ON (p.client_id = c.id)              
      ORDER BY c.id ,due_date DESC) AS idk WHERE DATE(due_date) <= DATE(now()) AND balance != '0' ORDER BY due_date DESC `;
    pool.query(sql).then((response) => {
      // console.log(response.rows);
      res.status(201).json(response.rows);
    });
  } catch (err) {
    console.error(err.message);
  }
});


app.post('/listQuit', (req, res) => {
  try {
    // var sql = `SELECT idk.id, idk.name, idk.street, idk.home_num, idk.district, idk.payday,idk.due_date, idk.balance FROM
    //           (SELECT DISTINCT ON (c.id) c.id, c.name, c.street, c.home_num, c.district, p.payday, p.payday + interval '1' DAY * p.deadline AS due_date,
    //           (SELECT SUM(p.balance) FROM payments AS p WHERE p.client_id = c.id) AS balance FROM payments AS p
    //           INNER JOIN clients AS c ON (p.client_id = c.id)

    //           ORDER BY c.id ,due_date DESC) AS idk ORDER BY due_date DESC`;

    var sql = `SELECT idk.id, idk.name, idk.street, idk.home_num, idk.district, idk.payday,idk.due_date, idk.balance FROM 
      (SELECT DISTINCT ON (c.id) c.id, c.name, c.street, c.home_num, c.district, p.payday, p.payday + interval '1' DAY * p.deadline AS due_date, 
      (SELECT SUM(p.balance) FROM payments AS p WHERE p.client_id = c.id) AS balance FROM payments AS p 
      INNER JOIN clients AS c ON (p.client_id = c.id)              
      ORDER BY c.id ,due_date DESC) AS idk WHERE balance = '0' ORDER BY due_date DESC `;
    pool.query(sql).then((response) => {
      // console.log(response.rows);
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
    console.log(req.body);
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
      .then((response) => {
        var values_payments = [
          response.rows[0].id,
          payment.balance,
          payment.payday,
          payment.deadline,
        ];
        pool
          .query(sql_payment, values_payments)
          .then(() => {
            res.status(201).json({ status: 1 });
          })
          .catch((e) => console.error(e.stack));
      })
      .catch((e) => {
        console.log(e.message);
        res.status(504).json({
        Teste: e.message
        })
      });
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/profile', (req, res) => {
  try {
    const { id } = req.body;
    var sql = `SELECT c.id, c.name, c.street, c.home_num,c.district,c.job,c.cpf,c.cep,c.telephone, 
      (SELECT SUM(balance) FROM payments AS p WHERE p.client_id = c.id) AS balance,
      (SELECT p.payday FROM payments AS p WHERE c.id = p.client_id ORDER BY p.payday DESC LIMIT 1),
      (SELECT p.deadline FROM payments AS p WHERE c.id = p.client_id ORDER BY p.payday DESC LIMIT 1) 
      FROM clients AS c LEFT JOIN payments AS p ON c.id = p.client_id WHERE c.id = $1 GROUP BY c.id 
      ORDER BY (SELECT p.payday FROM payments AS p WHERE c.id = p.client_id ORDER BY p.payday DESC LIMIT 1) + interval '1' DAY*(SELECT p.deadline FROM payments AS p WHERE c.id = p.client_id ORDER BY p.payday DESC LIMIT 1) DESC`;
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
    const { client, index } = req.body;
    var sql =
      'UPDATE clients SET name = $1, cpf = $2, street = $3, home_num = $4,  district = $5, cep = $6, telephone = $7, job = $8 WHERE id = $9';
    var values = [
      client.name,
      client.cpf,
      client.street,
      client.home_num,
      client.district,
      client.cep,
      client.telephone,
      client.job,
      index,
    ];
    pool
      .query(sql, values)
      .then(() => {
        res.status(201).json({ status: 1 });
      })
      .catch((e) => console.error(e.stack));
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/getSearch', (req, res) => {
  try {
    const { search, index } = req.body;
    // const auxSearch = ['error','c.cpf','c.name','error','c.street','c.district','c.job']
    //console.log(req.body)
    switch (index) {
      case 1:
        var sql = `SELECT idk.id, idk.name, idk.street, idk.home_num, idk.district, idk.payday,idk.due_date, idk.balance FROM 
          (SELECT DISTINCT ON (c.id) c.id, c.name, c.street, c.home_num, c.district, p.payday, p.payday + interval '1' DAY * p.deadline AS due_date, 
          (SELECT SUM(p.balance) FROM payments AS p WHERE p.client_id = c.id) AS balance FROM payments AS p 
          INNER JOIN clients AS c ON (p.client_id = c.id) 
          WHERE c.cpf LIKE '%'||$1||'%' ORDER BY c.id ,due_date DESC) AS idk ORDER BY due_date DESC`;
        var values = [search];

        pool.query(sql, values).then((response) => {
          res.status(201).json(response.rows);
        });

        break;
      case 2:
        var sql = `SELECT idk.id, idk.name, idk.street, idk.home_num, idk.district, idk.payday,idk.due_date, idk.balance FROM 
          (SELECT DISTINCT ON (c.id) c.id, c.name, c.street, c.home_num, c.district, p.payday, p.payday + interval '1' DAY * p.deadline AS due_date, 
          (SELECT SUM(p.balance) FROM payments AS p WHERE p.client_id = c.id) AS balance FROM payments AS p 
          INNER JOIN clients AS c ON (p.client_id = c.id) 
          WHERE c.name ~*$1 ORDER BY c.id ,due_date DESC) AS idk ORDER BY due_date DESC`;
        var values = [search];

        pool.query(sql, values).then((response) => {
          res.status(201).json(response.rows);
        });

        break;
      case 3:
        var sql = `SELECT idk.id, idk.name, idk.street, idk.home_num, idk.district, idk.payday,idk.due_date, idk.balance FROM 
          (SELECT DISTINCT ON (c.id) c.id, c.name, c.street, c.home_num, c.district, p.payday, p.payday + interval '1' DAY * p.deadline AS due_date, 
          (SELECT SUM(p.balance) FROM payments AS p WHERE p.client_id = c.id) AS balance FROM payments AS p 
          INNER JOIN clients AS c ON (p.client_id = c.id) 
          WHERE DATE(p.payday + interval '1' DAY * p.deadline) = $1 ORDER BY c.id ,due_date DESC) AS idk ORDER BY due_date DESC`;
        var values = [search];

        pool.query(sql, values).then((response) => {
          res.status(201).json(response.rows);
        });
        break;
      case 4:
        //LIKE '%'||$1||'%'
        var sql = `SELECT idk.id, idk.name, idk.street, idk.home_num, idk.district, idk.payday,idk.due_date, idk.balance FROM 
          (SELECT DISTINCT ON (c.id) c.id, c.name, c.street, c.home_num, c.district, p.payday, p.payday + interval '1' DAY * p.deadline AS due_date, 
          (SELECT SUM(p.balance) FROM payments AS p WHERE p.client_id = c.id) AS balance FROM payments AS p 
          INNER JOIN clients AS c ON (p.client_id = c.id) 
          WHERE c.street  ~*$1 ORDER BY c.id ,due_date DESC) AS idk ORDER BY due_date DESC`;
        var values = [search];

        pool.query(sql, values).then((response) => {
          res.status(201).json(response.rows);
        });
        break;
      case 5:
        //LIKE '%'||$1||'%'
        var sql = `SELECT idk.id, idk.name, idk.street, idk.home_num, idk.district, idk.payday,idk.due_date, idk.balance FROM 
            (SELECT DISTINCT ON (c.id) c.id, c.name, c.street, c.home_num, c.district, p.payday, p.payday + interval '1' DAY * p.deadline AS due_date, 
            (SELECT SUM(p.balance) FROM payments AS p WHERE p.client_id = c.id) AS balance FROM payments AS p 
            INNER JOIN clients AS c ON (p.client_id = c.id) 
            WHERE c.district  ~*$1 ORDER BY c.id ,due_date DESC) AS idk ORDER BY due_date DESC`;
        var values = [search];

        pool.query(sql, values).then((response) => {
          res.status(201).json(response.rows);
        });
        break;
      case 6:
        //LIKE '%'||$1||'%'
        var sql = `SELECT idk.id, idk.name, idk.street, idk.home_num, idk.district, idk.payday,idk.due_date, idk.balance FROM 
              (SELECT DISTINCT ON (c.id) c.id, c.name, c.street, c.home_num, c.district, p.payday, p.payday + interval '1' DAY * p.deadline AS due_date, 
              (SELECT SUM(p.balance) FROM payments AS p WHERE p.client_id = c.id) AS balance FROM payments AS p 
              INNER JOIN clients AS c ON (p.client_id = c.id) 
              WHERE c.job  ~*$1 ORDER BY c.id ,due_date DESC) AS idk ORDER BY due_date DESC`;
        var values = [search];

        pool.query(sql, values).then((response) => {
          res.status(201).json(response.rows);
        });
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
      .then(() => {
        res.status(201).json({ status: 1 });
      })
      .catch((e) => console.error(e.stack));
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/getHistoric', (req, res) => {
  try {
    const { id } = req.body;
    // console.log(id);
    var sql = `SELECT p.client_id, p.payday, p.balance, p.payday + interval '1' DAY * p.deadline AS due_date 
    FROM payments AS p WHERE p.client_id = $1 ORDER BY payday`;
    var values = [id];
    pool.query(sql, values).then((re) => {
      res.status(201).json(re.rows);
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/getBalance', (req, res) => {
  try {
    const { mouth, year, day } = req.body;
    const  date1  = year + "-" + mouth + "-" + 1;
    const  date2  = year + "-" + mouth + "-" + day;
    // console.log(date1)
    var sql = `SELECT p.client_id, p.payday, p.balance 
    FROM payments AS p WHERE p.payday >=  $1 AND p.payday <= $2 ORDER BY payday`;
    var values = [date1, date2];
    pool.query(sql, values).then((re) => {
      res.status(201).json(re.rows);
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
