const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();
const port = 5000;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
}));

const mongoURI = "mongodb+srv://rahulkush5225:Rahul52us@cluster0.uku04rj.mongodb.net/cyber";

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define MongoDB schema
const ipSchema = new mongoose.Schema({
  ipAddress: String,
  createdAt: { type: Date, default: Date.now }
});

const loginSchema = new mongoose.Schema({
  ipAddress: String,
  createdAt: { type: Date, default: Date.now }
});

const IpAddress = mongoose.model("IpAddress", ipSchema);
const LoginCount = mongoose.model("LoginCount", loginSchema);

// GET endpoint to fetch IP address
app.get("/", async (req, res) => {
  try {
    const { data } = await axios.get("https://api.ipify.org?format=json");
    const ipAddress = data.ip;

    // Check if IP address already exists in MongoDB
    const existingIp = await IpAddress.findOne({ ipAddress });

    if (!existingIp) {
      // Save IP address to MongoDB
      await IpAddress.create({ ipAddress });
    }

    // Retrieve visit count from MongoDB
    const visitCount = await IpAddress.countDocuments();
    res.status(200).send({ ipAddress, visitCount });
  } catch (error) {
    console.error("Error fetching IP address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/login", async (req, res) => {
  try {
    const { data } = await axios.get("https://api.ipify.org?format=json");
    const ipAddress = data.ip;
    const existingIp = await LoginCount.findOne({ ipAddress });
    if (!existingIp) {
      // Save IP address to MongoDB
      await LoginCount.create({ ipAddress });
    }
    const loginCount = await LoginCount.countDocuments();
    res.status(200).send({ loginCount });
  } catch (error) {
    console.error("Error fetching IP address:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
