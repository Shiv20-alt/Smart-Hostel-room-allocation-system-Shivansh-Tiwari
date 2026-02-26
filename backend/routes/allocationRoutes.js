const express = require("express");
const router = express.Router();
const {
    allocate,
    listAllocations,
    listAllocationsByRoom,
} = require("../controllers/allocationController");

router.post("/", allocate);
router.get("/", listAllocations);
router.get("/room/:roomId", listAllocationsByRoom);

module.exports = router;
