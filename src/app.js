const express = require('express');
const app = express();
app.use(express.json())
const healthRoutes = require('./routes/health');

app.use('/health', healthRoutes);
const movieRoutes = require('./routes/movies');
   app.use('/movies', movieRoutes);

const dbRoutes = require('./routes/test');
app.use('/test-db', dbRoutes);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const theatreRoutes = require('./routes/theatres');
app.use('/theatres', theatreRoutes);

const screenRoutes = require('./routes/screens');
app.use('/screens', screenRoutes);

const showRoutes = require('./routes/shows');
app.use('/shows', showRoutes);

const seatRoutes = require('./routes/seats');
app.use('/seats', seatRoutes);

const showSeatRoutes = require('./routes/showSeats');
app.use('/show-seats', showSeatRoutes);


const holdRoutes = require('./routes/holds');
app.use('/holds', holdRoutes);

const bookingRoutes = require('./routes/bookings');
app.use('/bookings', bookingRoutes);

module.exports = app;