const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        roomNo: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
        hasAC: {
            type: Boolean,
            default: false,
        },
        hasAttachedWashroom: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
