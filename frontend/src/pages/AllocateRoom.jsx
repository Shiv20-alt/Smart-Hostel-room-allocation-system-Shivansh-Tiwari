import { useState } from "react";
import API from "../services/api.js";

export default function AllocateRoom() {
    const [form, setForm] = useState({
        studentName: "",
        studentNumber: "",
        roomType: "",
        needsAC: false,
        needsWashroom: false,
    });
    const [availableRooms, setAvailableRooms] = useState(null);
    const [searching, setSearching] = useState(false);
    const [allocating, setAllocating] = useState(false);
    const [result, setResult] = useState(null);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleSearch(e) {
        e.preventDefault();
        setResult(null);
        setAvailableRooms(null);

        if (!form.studentName.trim()) {
            setResult({ type: "error", message: "Student name is required." });
            return;
        }
        if (!form.studentNumber.trim()) {
            setResult({ type: "error", message: "Student number is required." });
            return;
        }
        const roomType = parseInt(form.roomType, 10);
        if (!roomType || roomType <= 0) {
            setResult({ type: "error", message: "Please select a valid room type." });
            return;
        }

        setSearching(true);
        try {
            const params = { type: roomType };
            if (form.needsAC) params.ac = "true";
            if (form.needsWashroom) params.washroom = "true";
            const res = await API.get("/rooms/available", { params });
            setAvailableRooms(res.data);
        } catch {
            setResult({ type: "error", message: "Search failed." });
        } finally {
            setSearching(false);
        }
    }

    async function handleAllocate(roomId) {
        setAllocating(true);
        setResult(null);
        try {
            const res = await API.post("/allocate", {
                studentName: form.studentName.trim(),
                studentNumber: form.studentNumber.trim(),
                roomId,
            });
            setResult({
                type: "allocated",
                room: res.data.room,
                allocation: res.data.allocation,
            });
            setAvailableRooms(null);
            setForm({ studentName: "", studentNumber: "", roomType: "", needsAC: false, needsWashroom: false });
        } catch (err) {
            setResult({
                type: "error",
                message: err.response?.data?.error || "Allocation failed.",
            });
        } finally {
            setAllocating(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Allocate Room</h1>
                <p className="mt-2 text-gray-500">
                    Enter student details, find available rooms, then pick one.
                </p>
            </div>

            {/* Step 1: Student details + search */}
            <form
                onSubmit={handleSearch}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-6"
            >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">① Student Details</h2>

                <div className="grid gap-4 sm:grid-cols-2 mb-4">
                    <div>
                        <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                            Student Name
                        </label>
                        <input
                            id="studentName"
                            name="studentName"
                            value={form.studentName}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                    </div>
                    <div>
                        <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Roll Number
                        </label>
                        <input
                            id="studentNumber"
                            name="studentNumber"
                            value={form.studentNumber}
                            onChange={handleChange}
                            placeholder="e.g. STU-2024-001"
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                    </div>
                </div>

                <h2 className="text-lg font-semibold text-gray-800 mb-4 mt-6">② Room Requirements</h2>

                <div className="grid gap-4 sm:grid-cols-3 mb-4">
                    <div>
                        <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">
                            Room Type
                        </label>
                        <select
                            id="roomType"
                            name="roomType"
                            value={form.roomType}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                        >
                            <option value="">Select Room Type</option>
                            <option value="1">1-Seater</option>
                            <option value="2">2-Seater</option>
                            <option value="3">3-Seater</option>
                            <option value="4">4-Seater</option>
                            <option value="5">5-Seater</option>
                            <option value="6">6-Seater</option>
                        </select>
                    </div>
                    <div className="flex items-end pb-1">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" name="needsAC" checked={form.needsAC} onChange={handleChange} className="peer sr-only" />
                                <div className="w-11 h-6 rounded-full bg-gray-200 peer-checked:bg-indigo-500 transition-colors" />
                                <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform peer-checked:translate-x-5" />
                            </div>
                            <span className="text-sm text-gray-600">AC</span>
                        </label>
                    </div>
                    <div className="flex items-end pb-1">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" name="needsWashroom" checked={form.needsWashroom} onChange={handleChange} className="peer sr-only" />
                                <div className="w-11 h-6 rounded-full bg-gray-200 peer-checked:bg-indigo-500 transition-colors" />
                                <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform peer-checked:translate-x-5" />
                            </div>
                            <span className="text-sm text-gray-600">Washroom</span>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={searching}
                    className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {searching ? "Searching…" : "🔍 Find Available Rooms"}
                </button>
            </form>

            {/* Step 2: Available rooms list */}
            {availableRooms !== null && (
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-800">③ Choose a Room</h2>
                        <p className="text-sm text-gray-500">{availableRooms.length} room{availableRooms.length !== 1 ? "s" : ""} available</p>
                    </div>

                    {availableRooms.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-3">⚠️</div>
                            <p className="font-medium text-amber-600">No rooms available</p>
                            <p className="text-sm text-gray-500 mt-1">Try changing the requirements.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {availableRooms.map((room) => (
                                <div
                                    key={room._id}
                                    className="flex items-center justify-between px-6 py-4 hover:bg-indigo-50/30 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                            {room.roomNo}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-gray-900">Room {room.roomNo}</span>
                                                <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs font-medium">
                                                    {room.freeBeds} free bed{room.freeBeds !== 1 ? "s" : ""}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                <span>{room.occupied}/{room.capacity} occupied</span>
                                                {room.hasAC && <span className="text-emerald-600">✓ AC</span>}
                                                {room.hasAttachedWashroom && <span className="text-emerald-600">✓ Washroom</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAllocate(room._id)}
                                        disabled={allocating}
                                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                                    >
                                        {allocating ? "…" : "Select"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Result */}
            {result && result.type === "allocated" && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">✅</span>
                        <h3 className="text-lg font-bold text-emerald-700">Room Allocated Successfully!</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="text-gray-500">Student:</span> <span className="font-medium text-gray-900">{result.allocation.studentName}</span></div>
                        <div><span className="text-gray-500">Roll No:</span> <span className="font-medium text-gray-900">{result.allocation.studentNumber}</span></div>
                        <div><span className="text-gray-500">Room:</span> <span className="font-bold text-indigo-600">{result.room.roomNo}</span></div>
                        <div><span className="text-gray-500">Capacity:</span> <span className="font-medium text-gray-900">{result.room.capacity} beds</span></div>
                    </div>
                </div>
            )}

            {result && result.type === "error" && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
                    <p className="text-sm font-medium text-red-700">❌ {result.message}</p>
                </div>
            )}
        </div>
    );
}
