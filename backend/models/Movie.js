const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  seats:   [{ row: Number, col: Number }],
  bookedAt:{ type: Date, default: Date.now }
});

const MovieSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  rows:        { type: Number, required: true },
  cols:        { type: Number, required: true },
  startDate:   { type: Date,   required: true },
  endDate:     { type: Date,   required: true },
  time:        { type: String, required: true },
  price:       { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl:    { type: String },
  bookings:    [BookingSchema],
});

module.exports = mongoose.model('Movie', MovieSchema);
