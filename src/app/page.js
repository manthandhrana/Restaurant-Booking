"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "",
    name: "",
    contact: "",
    contactemail: "", // Added contactemail to formData
  });
  const [bookings, setBookings] = useState([]);
  const [userId, setUserId] = useState(""); // Initialize userId with an empty string

  // Fetch userId from localStorage on the client side
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId") || generateUserId(); // Generate or fetch userId ||
    document.cookie = `userId=${storedUserId}; path=/;`; // Set the cookie
    localStorage.setItem("userId", storedUserId); // Store in localStorage for later use
    setUserId(storedUserId);
  }, []);

  const generateUserId = () => {
    return Math.random().toString(36).substr(2, 9); // Random 9-character string
  };
  console.log(generateUserId)

  // Fetch existing bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/bookings", {
        credentials: "include", // Include cookies
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        console.error("Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData }),
        credentials: "include",
      });

      if (res.ok) {
        alert("Booking Successful!");
        setFormData({
          date: "",
          time: "",
          guests: "",
          name: "",
          contact: "",
          contactemail: "",
        });
        fetchBookings(); // Refresh bookings
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Error creating booking.");
      }
    } catch (err) {
      console.error("Error submitting booking:", err);
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleDelete = async (bookingId) => {
    try {
      const res = await fetch(`http://localhost:5000/bookings/${bookingId}`, {
        method: "DELETE",
        credentials: "include", // Include cookies
      });

      if (res.ok) {
        alert("Booking deleted successfully!");
        fetchBookings(); // Refresh bookings after deletion
      } else {
        alert("Error deleting booking.");
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1 className="header">Restaurant Table Booking</h1>
      <form onSubmit={handleSubmit}>
        <div className="rows">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            placeholder="Number Of Guests"
            required
          />
        </div>
        <div className="rows">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>
        <div className="rows">
          <input
            type="email"
            name="contactemail"
            value={formData.contactemail}
            onChange={handleChange}
            placeholder="Enter Your Email"
            required
          />
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            pattern="[1-9]{1}[0-9]{9}" // Ensures it matches a valid 10-digit mobile number pattern
            maxLength={10} // Limits the input to a maximum of 10 characters
            placeholder="Enter Your Number"
            required
          />
        </div>
        <div className="rows">
          <button type="submit" className="Button">
            Book Now
          </button>
        </div>
      </form>
      <h2 className="header">Existing Bookings</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Date</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Time</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Guests</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Contact</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index} style={{ textAlign: "left" }}>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{booking.date}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{booking.time}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{booking.guests}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{booking.name}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{booking.contact}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{booking.contactemail}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <button onClick={() => handleDelete(booking._id)} style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </main>
  );
}

