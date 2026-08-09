const express = require('express');
const app = express();

const healthRoutes = require('./routes/health');

app.use('/health', healthRoutes);
const movieRoutes = require('./routes/movies');
   app.use('/movies', movieRoutes);

const dbRoutes = require('./routes/test');
app.use('/test-db', dbRoutes);
module.exports = app;