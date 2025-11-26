// backend/routes/submissions.js
const express = require("express");
const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const auth = require("../middleware/auth");

const router = express.Router();

// All routes need login
router.use(auth);

// ⭐ STUDENT: see own submissions + feedback
// GET /api/submissions/my
router.get("/my", async (req, res) => {
  try {
    if (req.user.role !== "STUDENT") {
      return res.status(403).json({ message: "Only students can view this." });
    }

    const submissions = await Submission.find({ student: req.user.id })
      .populate("assignment", "title maxMarks deadline")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (err) {
    console.error("My submissions error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ⭐ STUDENT: submit assignment
// POST /api/submissions/:assignmentId
router.post("/:assignmentId", async (req, res) => {
  try {
    if (req.user.role !== "STUDENT") {
      return res.status(403).json({ message: "Only students can submit." });
    }

    const { assignmentId } = req.params;
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ message: "fileUrl is required" });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user.id,
      fileUrl
    });

    res.status(201).json({ message: "Submitted!", submission });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ⭐ TEACHER: view submissions for an assignment
// GET /api/submissions/:assignmentId
router.get("/:assignmentId", async (req, res) => {
  try {
    if (req.user.role !== "TEACHER") {
      return res.status(403).json({ message: "Only teachers can view submissions" });
    }

    const submissions = await Submission.find({ assignment: req.params.assignmentId })
      .populate("student", "name email")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (err) {
    console.error("View submissions error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ⭐ TEACHER: grade a submission
// PUT /api/submissions/:submissionId
router.put("/:submissionId", async (req, res) => {
  try {
    if (req.user.role !== "TEACHER") {
      return res.status(403).json({ message: "Only teachers can grade submissions" });
    }

    const { marks, feedback } = req.body;
    const { submissionId } = req.params;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.marks = marks;
    submission.feedback = feedback;
    await submission.save();

    res.json({ message: "Updated", submission });
  } catch (err) {
    console.error("Grade error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
