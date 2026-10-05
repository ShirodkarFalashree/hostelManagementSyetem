let rooms = [
  {
    id: "ROOM-B203",
    hostel: "Hostel B (Girls Hostel)",
    block: "Block B",
    floor: "2nd Floor",
    roomNumber: "B-203",
    roomType: "Double Shared - AC",
    capacity: 2,
    occupancy: 2,
    status: "OCCUPIED",
    amenities: ["AC", "Attached Washroom", "Wi-Fi Router", "Balcony", "2 Study Desks"],
    beds: [
      { bedNo: "Bed-1", status: "OCCUPIED", student: "Falashree (2024CS1042)" },
      { bedNo: "Bed-2", status: "OCCUPIED", student: "Ananya Deshmukh (2024CS1088)" },
    ],
  },
  {
    id: "ROOM-B204",
    hostel: "Hostel B (Girls Hostel)",
    block: "Block B",
    floor: "2nd Floor",
    roomNumber: "B-204",
    roomType: "Double Shared - Non AC",
    capacity: 2,
    occupancy: 1,
    status: "AVAILABLE",
    amenities: ["Fan", "Wi-Fi", "Balcony", "Study Desks"],
    beds: [
      { bedNo: "Bed-1", status: "OCCUPIED", student: "Sneha Patel (2024EC1090)" },
      { bedNo: "Bed-2", status: "AVAILABLE", student: null },
    ],
  },
];

let roomChanges = [];

const getRooms = (req, res) => res.json({ success: true, count: rooms.length, data: rooms });

const updateRoom = (req, res) => {
  const roomData = req.body;
  const idx = rooms.findIndex((r) => r.id === roomData.id || r.id === req.params.id);
  if (idx >= 0) {
    rooms[idx] = { ...rooms[idx], ...roomData };
  } else {
    rooms.push(roomData);
  }
  res.json({ success: true, message: "Room updated", data: roomData });
};

const getRoomChanges = (req, res) => res.json({ success: true, count: roomChanges.length, data: roomChanges });

const createRoomChange = (req, res) => {
  const reqData = req.body;
  roomChanges.unshift(reqData);
  res.status(201).json({ success: true, message: "Room change request submitted", data: reqData });
};

module.exports = {
  getRooms,
  updateRoom,
  getRoomChanges,
  createRoomChange,
};
