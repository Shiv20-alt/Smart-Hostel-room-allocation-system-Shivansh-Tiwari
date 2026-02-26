const express = require("express");
const router = express.Router();
const { addRoom, listRooms, listAvailableRooms, removeRoom } = require("../controllers/roomController");

router.post("/", addRoom);
router.get("/", listRooms);
router.get("/available", listAvailableRooms);
router.delete("/:id", removeRoom);

module.exports = router;
