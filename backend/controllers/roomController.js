const { createRoom, getRooms, searchAvailableRooms, deleteRoom } = require("../services/roomService");

/**
 * POST /api/rooms - Add a new room
 */
async function addRoom(req, res, next) {
    try {
        const { roomNo, capacity, hasAC, hasAttachedWashroom } = req.body;

        if (!roomNo || typeof roomNo !== "string" || roomNo.trim() === "") {
            return res.status(400).json({ error: "Room number is required" });
        }
        if (!capacity || !Number.isInteger(capacity) || capacity <= 0) {
            return res.status(400).json({ error: "Capacity must be a positive integer" });
        }

        const room = await createRoom({
            roomNo: roomNo.trim(),
            capacity,
            hasAC: Boolean(hasAC),
            hasAttachedWashroom: Boolean(hasAttachedWashroom),
        });

        res.status(201).json({ message: "Room added successfully", room });
    } catch (err) {
        if (err.status === 400) {
            return res.status(400).json({ error: err.message });
        }
        next(err);
    }
}

/**
 * GET /api/rooms - List all rooms with occupied count
 */
async function listRooms(req, res, next) {
    try {
        const { capacity, ac, washroom } = req.query;
        const rooms = await getRooms({ capacity, ac, washroom });
        res.status(200).json(rooms);
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/rooms/available - Search rooms with free beds
 */
async function listAvailableRooms(req, res, next) {
    try {
        const { type, ac, washroom } = req.query;
        // type means exact room capacity (e.g. 1-seater, 2-seater)
        // bedsNeeded is always 1 because we just need 1 free bed in that room
        const capacity = type ? Number(type) : null;
        const rooms = await searchAvailableRooms({
            capacity,
            bedsNeeded: 1,
            ac: ac === "true",
            washroom: washroom === "true",
        });
        res.status(200).json(rooms);
    } catch (err) {
        next(err);
    }
}

/**
 * DELETE /api/rooms/:id - Delete a room
 */
async function removeRoom(req, res, next) {
    try {
        await deleteRoom(req.params.id);
        res.status(200).json({ message: "Room deleted successfully" });
    } catch (err) {
        next(err);
    }
}

module.exports = { addRoom, listRooms, listAvailableRooms, removeRoom };
