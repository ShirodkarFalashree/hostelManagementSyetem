const express = require("express");
const router = express.Router();
const { getFees, getPayments, processPayment } = require("../controllers/feeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getFees);
router.get("/payments", protect, getPayments);
router.post("/pay", protect, processPayment);

module.exports = router;
