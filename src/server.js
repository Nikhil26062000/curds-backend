require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;
const db = require("../src/db/conn");
const Table = require("../src/models/form.model");
const nodemailer = require("nodemailer");

const cors = require("cors");
app.use(bodyParser.json());
// Middleware for cors and adding options for cors
const corsOptions = {
  origin: "http://localhost:5173",
  method: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

db(); // Connect to the database

// GET request to fetch all table data
app.get("/api/form", async (req, res) => {
  try {
    const tableData = await Table.find(); // Fetch all documents from the Table collection
    res.json(tableData); // Send the fetched data as JSON response
  } catch (error) {
    console.error("Error fetching table data:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST request to save table data to the database
app.post("/api/form", async (req, res) => {
  try {
    const { name, phoneNumber, email, hobbies } = req.body; // Extract data from request body
    const newTableRow = new Table({ name, phoneNumber, email, hobbies }); // Create a new document using the Table model
    await newTableRow.save(); // Save the new document to the database
    res.status(201).json({ message: "Table data saved successfully" });
  } catch (error) {
    console.error("Error saving table data:", error);
    res.status(500).json({ message: "Server Error" });
  }
});



app.put("/api/form/:id", async (req, res) => {
  try {
    const { name, phoneNumber, email, hobbies } = req.body; // Extract updated data from request body
    
    // Update the document based on its ID
    const updatedTableRow = await Table.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { name, phoneNumber, email, hobbies } },
      
    );

    // Check if the document exists
    if (!updatedTableRow) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ message: "Table data updated successfully", updatedTableRow });
  } catch (error) {
    console.error("Error updating table data:", error);
    res.status(500).json({ message: "Server Error" });
  }
});





// DELETE request to delete table data from the database
app.delete("/api/form/:id", async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id); // Find the document by ID and delete it
    res.json({ message: "Table data deleted successfully" });
  } catch (error) {
    console.error("Error deleting table data:", error);
    res.status(500).json({ message: "Server Error" });
  }
});





app.post('/send-email', async (req, res) => {
  const { to, subject, body } = req.body;

  try {
    // Create a Nodemailer transporter using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ID, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Email message options
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to,
      subject,
      text: body,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
    res.status(500).send('Error sending email');
  }
});
app.listen(PORT, () => {
  console.log("Server is running on Port", PORT);
});
