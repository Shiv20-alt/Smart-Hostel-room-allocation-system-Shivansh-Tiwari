const mongoose = require("mongoose");

const allocationSchema = new mongoose.Schema(
    {
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        studentName: {
            type: String,
            required: true,
            trim: true,
        },
        studentNumber: {
            type: String,
            required: true,
            trim: true,
        },
        studentsCount: {
            type: Number,
            required: true,
            min: 1,
        },
        needsAC: {
            type: Boolean,
            default: false,
        },
        needsWashroom: {
            type: Boolean,
            default: false,
        },
        allocatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Allocation", allocationSchema);
