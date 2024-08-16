const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'NSSO_BACKEND',
  password: 'manager',
  port: 5432,
});

app.use(bodyParser.json());
app.use(cors());

app.post('/store-json', async (req, res) => {
  const jsonData = req.body;
  console.log('json', jsonData);
  try {
    const result = await pool.query(
      'INSERT INTO t_json_data (data) VALUES ($1) RETURNING id',
      [jsonData]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error storing JSON data');
  }
});

app.get('/get-json/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT data FROM t_json_data WHERE id = $1',
      [id]
    );
    console.log('res', result);

    if (result.rows.length === 0) {
      return res.status(404).send('JSON data not found');
    }

    res.json(result.rows[0].data);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).send('Error retrieving JSON data');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
