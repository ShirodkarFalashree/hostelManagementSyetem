const express = require("express");
const router = express.Router();
const { getVisitors, addVisitor, updateVisitor } = require("../controllers/visitorController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getVisitors);
router.post("/", protect, addVisitor);
router.patch("/:id", protect, updateVisitor);

module.exports = router;
