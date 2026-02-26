const Room = require("../models/Room");
const Allocation = require("../models/Allocation");

/**
 * Insert a new room into the database.
 */
async function createRoom({ roomNo, capacity, hasAC, hasAttachedWashroom }) {
    const existing = await Room.findOne({ roomNo });
    if (existing) {
        const err = new Error(`Room number "${roomNo}" already exists`);
        err.status = 400;
        throw err;
    }

    const room = await Room.create({ roomNo, capacity, hasAC, hasAttachedWashroom });
    return room;
}

/**
 * Fetch all rooms with occupied bed count.
 * Optionally filtered by capacity, AC, washroom.
 */
async function getRooms({ capacity, ac, washroom } = {}) {
    const filter = {};

    if (capacity) {
        filter.capacity = { $gte: Number(capacity) };
    }
    if (ac === "true") {
        filter.hasAC = true;
    }
    if (washroom === "true") {
        filter.hasAttachedWashroom = true;
    }

    const rooms = await Room.find(filter).sort({ roomNo: 1 }).lean();

    // Get occupied count for each room
    const occupiedCounts = await Allocation.aggregate([
        { $group: { _id: "$roomId", occupied: { $sum: 1 } } },
    ]);

    const occupiedMap = {};
    occupiedCounts.forEach((item) => {
        occupiedMap[item._id.toString()] = item.occupied;
    });

    // Attach occupied count to each room
    return rooms.map((room) => ({
        ...room,
        occupied: occupiedMap[room._id.toString()] || 0,
    }));
}

/**
 * Search for available rooms with free beds.
 * Returns rooms where (capacity - occupied) >= bedsNeeded.
 */
async function searchAvailableRooms({ capacity, bedsNeeded, ac, washroom }) {
    const filter = {};

    if (capacity) {
        filter.capacity = Number(capacity);
    }
    if (ac) {
        filter.hasAC = true;
    }
    if (washroom) {
        filter.hasAttachedWashroom = true;
    }

    const rooms = await Room.find(filter).sort({ capacity: 1 }).lean();

    // Get occupied count for each room
    const occupiedCounts = await Allocation.aggregate([
        { $group: { _id: "$roomId", occupied: { $sum: 1 } } },
    ]);

    const occupiedMap = {};
    occupiedCounts.forEach((item) => {
        occupiedMap[item._id.toString()] = item.occupied;
    });

    // Filter rooms with enough free beds
    return rooms
        .map((room) => {
            const occupied = occupiedMap[room._id.toString()] || 0;
            return { ...room, occupied, freeBeds: room.capacity - occupied };
        })
        .filter((room) => room.freeBeds >= bedsNeeded);
}

/**
 * Delete a room by ID.
 */
async function deleteRoom(id) {
    await Allocation.deleteMany({ roomId: id });
    await Room.findByIdAndDelete(id);
}

module.exports = { createRoom, getRooms, searchAvailableRooms, deleteRoom };
