const express = require("express");
const router = express.Router();
const { getRooms, updateRoom, getRoomChanges, createRoomChange } = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getRooms);
router.put("/:id", protect, updateRoom);
router.post("/", protect, updateRoom);
router.get("/changes", protect, getRoomChanges);
router.post("/changes", protect, createRoomChange);

module.exports = router;
