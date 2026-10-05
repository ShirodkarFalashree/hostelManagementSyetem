const express = require("express");
const router = express.Router();
const {
  getApplications,
  getApplicationById,
  createOrUpdateApplication,
  updateStatus,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getApplications);
router.get("/:id", protect, getApplicationById);
router.post("/", protect, createOrUpdateApplication);
router.patch("/:id/status", protect, updateStatus);

module.exports = router;
