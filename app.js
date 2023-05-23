const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Configure Sequelize
const sequelize = new Sequelize('railway', 'root', 'B95Znr7v0CiyIOhMdWa3', {
  host: 'containers-us-west-144.railway.app',
  port: 6779,
  dialect: 'mysql'
});

// Define the Package model
const Package = sequelize.define('Package', {
  Tgl: {
    type: DataTypes.DATE
  },
  NoSP: {
    type: DataTypes.STRING
  },
  Pengirim: {
    type: DataTypes.STRING
  },
  Status: {
    type: DataTypes.STRING
  },
  Penerima: {
    type: DataTypes.STRING
  },
  Jumlah: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'paket'
});

// Connect to the database
sequelize.authenticate()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

// Get tracking data based on tracking number
app.post('/getTrackingData', (req, res) => {
  const trackingNumber = req.body.resi;

  Package.findOne({
    where: { NoSP: trackingNumber }
  })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error('Error retrieving tracking data:', err);
      res.sendStatus(500);
    });
});

// Save new package data
app.post('/savePaket', (req, res) => {
  const { tgl, noSp, pengirim, status, penerima, jumlah } = req.body;

  Package.create({
    Tgl: tgl,
    NoSP: noSp,
    Pengirim: pengirim,
    Status: status,
    Penerima: penerima,
    Jumlah: jumlah
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.error('Error saving package data:', err);
      res.sendStatus(500);
    });
});

// Get the package list
app.get('/getPaketList', (req, res) => {
  Package.findAll()
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.error('Error retrieving package list:', err);
      res.sendStatus(500);
    });
});

// Create a new package
app.post('/createPackage', (req, res) => {
  const { tgl, noSp, pengirim, status, penerima, jumlah } = req.body;

  Package.create({
    Tgl: tgl,
    NoSP: noSp,
    Pengirim: pengirim,
    Status: status,
    Penerima: penerima,
    Jumlah: jumlah
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.error('Error creating package:', err);
      res.sendStatus(500);
    });
});

// Update an existing package
app.put('/updatePackage/:id', (req, res) => {
  const { id } = req.params;
  const { tgl, noSp, pengirim, status, penerima, jumlah } = req.body;

  Package.update({
    Tgl: tgl,
    NoSP: noSp,
    Pengirim: pengirim,
    Status: status,
    Penerima: penerima,
    Jumlah: jumlah
  }, {
    where: { id: id }
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.error('Error updating package:', err);
      res.sendStatus(500);
    });
});

// Delete a package
app.delete('/deletePackage/:id', (req, res) => {
  const { id } = req.params;

  Package.destroy({
    where: { id: id }
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.error('Error deleting package:', err);
      res.sendStatus(500);
    });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}...`);
});

