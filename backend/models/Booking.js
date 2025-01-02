const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  date: String,
  time: String,
  guests: Number,
  name: String,
  contact: { type: Number, maxlength: 10 },
  userId: String, // The ID of the user making the booking
  contactemail: String
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
