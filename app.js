const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// MySQL Configuration
const dbConfig = {
  host: 'containers-us-west-144.railway.app',
  port: 6779, // Ganti dengan port yang sesuai
  user: 'root',
  password: 'B95Znr7v0CiyIOhMdWa3',
  database: 'railway',
};


// Create a MySQL connection
const connection = mysql.createConnection(dbConfig);

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Get tracking data based on tracking number
app.post('/getTrackingData', (req, res) => {
  const trackingNumber = req.body.resi;

  const query = 'SELECT * FROM paket WHERE NoSP = ?';
  connection.query(query, [trackingNumber], (err, results) => {
    if (err) {
      console.error('Error retrieving tracking data:', err);
      res.sendStatus(500);
      return;
    }

    res.json(results);
  });
});

// Save new package data
app.post('/savePaket', (req, res) => {
  const { tgl, noSp, pengirim, status, penerima, jumlah } = req.body;

  const query = 'INSERT INTO paket (Tgl, NoSP, Pengirim, Status, Penerima, Jumlah) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [tgl, noSp, pengirim, status, penerima, jumlah], (err) => {
    if (err) {
      console.error('Error saving package data:', err);
      res.sendStatus(500);
      return;
    }

    res.sendStatus(200);
  });
});

app.get('/', (req, res) => {
  res.send('API shipping')
})

// Get the package list
app.get('/getPaketList', (req, res) => {
  const query = 'SELECT * FROM paket';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving package list:', err);
      res.sendStatus(500);
      return;
    }

    res.json(results);
  });
});

// Create a new package
app.post('/createPackage', (req, res) => {
    const { tgl, noSp, pengirim, status, penerima, jumlah } = req.body;
  
    const query = 'INSERT INTO paket (Tgl, NoSP, Pengirim, Status, Penerima, Jumlah) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [tgl, noSp, pengirim, status, penerima, jumlah], (err) => {
      if (err) {
        console.error('Error creating package:', err);
        res.sendStatus(500);
        return;
      }
  
      res.sendStatus(200);
    });
  });

// Update an existing package
app.put('/updatePackage/:id', (req, res) => {
    const { id } = req.params;
    const { tgl, noSp, pengirim, status, penerima, jumlah } = req.body;
  
    const query = 'UPDATE paket SET Tgl = ?, NoSP = ?, Pengirim = ?, Status = ?, Penerima = ?, Jumlah = ? WHERE id = ?';
    connection.query(query, [tgl, noSp, pengirim, status, penerima, jumlah, id], (err) => {
      if (err) {
        console.error('Error updating package:', err);
        res.sendStatus(500);
        return;
      }
  
      res.sendStatus(200);
    });
  });

// Delete a package
app.delete('/deletePackage/:id', (req, res) => {
    const { id } = req.params;
  
    const query = 'DELETE FROM paket WHERE id = ?';
    connection.query(query, [id], (err) => {
      if (err) {
        console.error('Error deleting package:', err);
        res.sendStatus(500);
        return;
      }
  
      res.sendStatus(200);
    });
  });

// Start the server
app.listen(PORT, () => console.log(`Sever is running port ${PORT} ...`));
