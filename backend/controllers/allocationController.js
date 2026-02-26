const {
    allocateRoom,
    getAllocations,
    getAllocationsByRoom,
} = require("../services/allocationService");

/**
 * POST /api/allocate - Allocate a student to a chosen room
 */
async function allocate(req, res, next) {
    try {
        const { studentName, studentNumber, roomId } = req.body;

        if (!studentName || typeof studentName !== "string" || studentName.trim() === "") {
            return res.status(400).json({ error: "Student name is required" });
        }
        if (!studentNumber || typeof studentNumber !== "string" || studentNumber.trim() === "") {
            return res.status(400).json({ error: "Student number is required" });
        }
        if (!roomId) {
            return res.status(400).json({ error: "Room selection is required" });
        }

        const result = await allocateRoom({
            studentName: studentName.trim(),
            studentNumber: studentNumber.trim(),
            roomId,
        });

        res.status(200).json({
            message: "Room allocated successfully",
            allocation: result.allocation,
            room: result.room,
        });
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }
        next(err);
    }
}

/**
 * GET /api/allocations - List all allocations
 */
async function listAllocations(req, res, next) {
    try {
        const allocations = await getAllocations();
        res.status(200).json(allocations);
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/allocations/room/:roomId - List allocations for a specific room
 */
async function listAllocationsByRoom(req, res, next) {
    try {
        const allocations = await getAllocationsByRoom(req.params.roomId);
        res.status(200).json(allocations);
    } catch (err) {
        next(err);
    }
}

module.exports = { allocate, listAllocations, listAllocationsByRoom };
