// server.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/candidate-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define Schema and Model
const candidateSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  skills: [String],
  location: String,
  videoInterviewResult: String,
  codingResult: String,
  yearsOfExperience: String,
});
const Candidate = mongoose.model("Candidate", candidateSchema);

// Routes
app.get("/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/candidates", async (req, res) => {
  const newCandidate = new Candidate(req.body);
  console.log("The new candidate is " + newCandidate);
  try {
    await newCandidate.save();
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/candidates/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCandidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/candidates/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Candidate.findByIdAndDelete(id);
    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/user/profile", async (req, res) => {
  const { firstName, lastName } = req.query;

  try {
    // Find the candidate based on firstName and lastName
    const candidate = await Candidate.findOne({ firstName, lastName });

    if (!candidate) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
