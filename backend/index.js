const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Add this
const fs = require("fs");
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config()
const mongoose = require("mongoose")
const mongo_uri = process.env.db_uri;
const Booking = require("./models/Booking")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors({ origin: "*", credentials: true })); // Allow credentials
app.use(cookieParser()); // Use the cookie-parser middleware

mongoose.connect(mongo_uri) .then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("MongoDB connection error:", error.message);
});

// Handle fetching user-specific bookings
app.get("/bookings", async (req, res) => {
  const userId = req.cookies.userId;
  const userBookings = await Booking.find({ userId });
  res.json(userBookings);
});

// Handle creating new bookings
app.post("/bookings", async (req, res) => {
  const { date, time, guests, name, contact, contactemail } = req.body;
  const userId = req.cookies.userId; // Get userId from cookies

  const bookingDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    // Check if the booking is in the past
    if (bookingDateTime < now) {
      return res.status(400).json({ error: "Cannot book a time in the past." });
    }

  if (!userId) {
    return res.status(400).json({ error: "User not logged in" });
  }
  const newBooking = { date, time, guests, name, contact, userId, contactemail };

  const duplicate = await Booking.findOne({ date, time, userId });
  if (duplicate) {
    return res.status(400).json({ error: "Duplicate booking for the same date, time, and user!" });
  }
  const booking = new Booking({ date, time, guests, name, contact, userId, contactemail })
  await booking.save()
  res.status(201).json(newBooking);
});

// Handle deleting a specific booking
app.delete("/bookings/:id", async (req, res) => {
  const bookingId = req.params.id; // Get booking ID from URL
  const userId = req.cookies.userId; // Get userId from cookies

  if (!userId) {
    return res.status(400).json({ error: "User not logged in" });
  }

  try {
    // Find and delete the booking
    const deletedBooking = await Booking.findOneAndDelete({ _id: bookingId, userId });

    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found or unauthorized" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
