// backend/routes/movies.js

const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const multer  = require('multer');
const {
  getMovies,
  getMovieById,
  addMovie,
  deleteMovie,
  bookSeats,
  cancelBooking,
  getHistory
} = require('../controllers/movieController');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ———— USER HISTORY ————
// MUST come before the '/:id' route, otherwise '/history' is treated as an ID
router.get('/history', auth('user'), getHistory);

// ———— MOVIE LIST & DETAILS ————
router.get('/',       auth(),          getMovies);
router.get('/:id',    auth(),          getMovieById);

// ———— ADMIN ROUTES ————
router.post('/',      auth('admin'),   upload.single('image'), addMovie);
router.delete('/:id', auth('admin'),   deleteMovie);

// ———— BOOKING ROUTES ————
router.post('/:id/book',   auth('user'), bookSeats);
router.post('/:id/cancel', auth('user'), cancelBooking);

module.exports = router;
