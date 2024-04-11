const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const http = require("http");

const app = express();
const port = 5000;

const corsOptions = {
  origin: "*",
  methods: ["GET"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Include cookies for authorized requests (if applicable)
  optionsSuccessStatus: 200, // Allow only specified headers
};

app.use(cors({
  origin : "*",
  methods:["GET","POST","PATCH","PUT","DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Include cookies for authorized requests (if applicable)
  optionsSuccessStatus: 200, // Allow only specified headers

}));

// Define MongoDB connection string
const mongoURI =
  "mongodb+srv://uknownwarrior04:DrMXfg7dsC7al4Hl@cyber.89hsngn.mongodb.net/?retryWrites=true&w=majority&appName=cyber";

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define MongoDB schema
const ipSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const loginSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
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

    res.json({ ipAddress, visitCount });
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
    res.json({ loginCount });
  } catch (error) {
    console.error("Error fetching IP address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use('/',(req, res) => {
  res.status(200).send("This is app page")
})

app.use('/rahul',(req, res) => {
  res.status(200).send("This is app page1 010")
})


// Start HTTP server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
