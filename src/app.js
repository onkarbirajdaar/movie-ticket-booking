const express = require('express');
const app = express();
app.use(express.json())
const healthRoutes = require('./routes/health');

app.use('/health', healthRoutes);
const movieRoutes = require('./routes/movies');
   app.use('/movies', movieRoutes);

const dbRoutes = require('./routes/test');
app.use('/test-db', dbRoutes);
const registerRoutes = require('./routes/auth');
app.use('/register' , registerRoutes);
module.exports = app;