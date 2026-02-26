const Room = require("../models/Room");
const Allocation = require("../models/Allocation");

/**
 * Allocate a student to a specific room (chosen by user).
 */
async function allocateRoom({ studentName, studentNumber, roomId }) {
    // Verify room exists
    const room = await Room.findById(roomId);
    if (!room) {
        const err = new Error("Room not found");
        err.status = 404;
        throw err;
    }

    // Check if room has free beds
    const occupiedCount = await Allocation.countDocuments({ roomId });
    if (occupiedCount >= room.capacity) {
        const err = new Error("Room is fully occupied");
        err.status = 400;
        throw err;
    }

    // Create allocation
    const allocation = await Allocation.create({
        roomId: room._id,
        studentName,
        studentNumber,
        studentsCount: 1,
        needsAC: room.hasAC,
        needsWashroom: room.hasAttachedWashroom,
    });

    return { allocation, room };
}

/**
 * Fetch all allocations with room details.
 */
async function getAllocations() {
    const allocations = await Allocation.find()
        .populate("roomId")
        .sort({ allocatedAt: -1 });
    return allocations;
}

/**
 * Fetch allocations for a specific room.
 */
async function getAllocationsByRoom(roomId) {
    const allocations = await Allocation.find({ roomId })
        .sort({ allocatedAt: -1 });
    return allocations;
}

module.exports = { allocateRoom, getAllocations, getAllocationsByRoom };
