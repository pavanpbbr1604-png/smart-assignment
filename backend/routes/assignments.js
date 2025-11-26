// backend/routes/assignments.js
const express = require("express");
const Assignment = require("../models/Assignment");
const auth = require("../middleware/auth");

const router = express.Router();

// All routes here require login
router.use(auth);

// TEACHER: create assignment
// POST /api/assignments
router.post("/", async (req, res) => {
  try {
    if (req.user.role !== "TEACHER") {
      return res.status(403).json({ message: "Only teachers can create assignments" });
    }

    const { title, description, maxMarks, deadline } = req.body;

    if (!title || !maxMarks || !deadline) {
      return res.status(400).json({ message: "Title, maxMarks, and deadline are required" });
    }

    const assignment = await Assignment.create({
      title,
      description,
      maxMarks,
      deadline,
      teacher: req.user.id
    });

    res.status(201).json(assignment);
  } catch (err) {
    console.error("Create assignment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// TEACHER: get my assignments
// GET /api/assignments/teacher
router.get("/teacher", async (req, res) => {
  try {
    if (req.user.role !== "TEACHER") {
      return res.status(403).json({ message: "Only teachers can view this" });
    }

    const assignments = await Assignment.find({ teacher: req.user.id })
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (err) {
    console.error("Teacher assignments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// STUDENT: get all assignments (for now)
// GET /api/assignments/student
router.get("/student", async (req, res) => {
  try {
    if (req.user.role !== "STUDENT") {
      return res.status(403).json({ message: "Only students can view this" });
    }

    const assignments = await Assignment.find()
      .populate("teacher", "name email")
      .sort({ deadline: 1 });

    res.json(assignments);
  } catch (err) {
    console.error("Student assignments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
