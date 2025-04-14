const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use('/api/donors', require('routes/donorRoutes'));
app.use('/api/requests', require('routes/requestRoutes'));
app.use('/api/sos', require('routes/sosRoutes'));
app.use('/api/plasma', require('routes/plasmaRoutes'));

// SYNC DATABASE AND START SERVER
db.sequelize.sync().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log('✅ Server running with SQL DB');
  });
}).catch(err => console.error('❌ DB Error:', err));
