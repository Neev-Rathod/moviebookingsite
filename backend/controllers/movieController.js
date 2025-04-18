const Movie = require('../models/Movie');

// GET /api/movies
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().lean();
    const formatted = movies.map(m => {
      const total = m.rows * m.cols;
      const bookedCount = m.bookings.reduce((sum, b) => sum + b.seats.length, 0);
      return {
        id: m._id,
        name: m.name,
        rows: m.rows,
        cols: m.cols,
        startDate: m.startDate,
        endDate: m.endDate,
        time: m.time,
        price: m.price,
        description: m.description,
        imageUrl: m.imageUrl,
        seatsRemaining: total - bookedCount,
        status: bookedCount === total ? 'House full' : `${total - bookedCount} seats remaining`
      };
    });
    res.json(formatted);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// GET /api/movies/:id
exports.getMovieById = async (req, res) => {
  try {
    const m = await Movie.findById(req.params.id).lean();
    if (!m) return res.status(404).json({ msg: 'Movie not found' });
    const booked = m.bookings.flatMap(b => b.seats.map(s => `${s.row}-${s.col}`));
    res.json({
      id: m._id,
      name: m.name,
      rows: m.rows,
      cols: m.cols,
      startDate: m.startDate,
      endDate: m.endDate,
      time: m.time,
      price: m.price,
      description: m.description,
      imageUrl: m.imageUrl,
      booked
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// POST /api/movies  (admin)
exports.addMovie = async (req, res) => {
  const { name, rows, cols, startDate, endDate, time, price, description } = req.body;
  const imageUrl = req.file
    ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    : null;
  try {
    const movie = new Movie({ name, rows, cols, startDate, endDate, time, price, description, imageUrl });
    await movie.save();
    res.json(movie);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// DELETE /api/movies/:id  (admin)
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ msg: 'Movie not found' });
    await movie.remove();
    res.json({ msg: 'Movie deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// POST /api/movies/:id/book  (user)
exports.bookSeats = async (req, res) => {
  const userId = req.user.id;
  const { seats } = req.body; // [{row, col},...]
  if (!Array.isArray(seats) || seats.length < 1 || seats.length > 4)
    return res.status(400).json({ msg: 'Must book between 1 and 4 seats' });

  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ msg: 'Movie not found' });

    // check availability
    const bookedSet = new Set(movie.bookings.flatMap(b => b.seats.map(s => `${s.row}-${s.col}`)));
    for (let s of seats) {
      const key = `${s.row}-${s.col}`;
      if (bookedSet.has(key))
        return res.status(400).json({ msg: `Seat ${key} already booked` });
    }

    // add to user's booking
    let booking = movie.bookings.find(b => b.user.toString() === userId);
    if (booking) {
      if (booking.seats.length + seats.length > 4)
        return res.status(400).json({ msg: 'Total seats per user cannot exceed 4' });
      booking.seats.push(...seats);
    } else {
      movie.bookings.push({ user: userId, seats });
    }

    await movie.save();
    res.json({ msg: 'Booked successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// POST /api/movies/:id/cancel  (user)
exports.cancelBooking = async (req, res) => {
  const userId = req.user.id;
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ msg: 'Movie not found' });
    movie.bookings = movie.bookings.filter(b => b.user.toString() !== userId);
    await movie.save();
    res.json({ msg: 'Booking cancelled' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// GET /api/movies/history  (user)
exports.getHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const movies = await Movie.find({ 'bookings.user': userId }).lean();
    const history = movies.map(m => {
      const b = m.bookings.find(x => x.user.toString() === userId);
      return {
        movieId:   m._id,
        name:      m.name,
        seats:     b.seats,
        price:     m.price,
        bookedAt:  b.bookedAt,
        imageUrl:  m.imageUrl,
        time:      m.time,
        startDate: m.startDate,
        endDate:   m.endDate
      };
    });
    res.json(history);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
