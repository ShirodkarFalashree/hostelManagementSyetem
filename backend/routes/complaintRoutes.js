const express = require("express");
const router = express.Router();
const {
  getComplaints,
  addComplaint,
  updateComplaint,
  getWorkOrders,
  updateWorkOrder,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getComplaints);
router.post("/", protect, addComplaint);
router.patch("/:id", protect, updateComplaint);
router.get("/workorders", protect, getWorkOrders);
router.put("/workorders/:id", protect, updateWorkOrder);

module.exports = router;
