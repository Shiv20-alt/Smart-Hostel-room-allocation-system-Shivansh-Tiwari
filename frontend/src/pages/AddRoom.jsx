import { useState } from "react";
import API from "../services/api.js";

export default function AddRoom() {
    const [form, setForm] = useState({
        roomNo: "",
        capacity: "",
        hasAC: false,
        hasAttachedWashroom: false,
    });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus(null);

        if (!form.roomNo.trim()) {
            setStatus({ type: "error", message: "Room number is required." });
            return;
        }
        const cap = parseInt(form.capacity, 10);
        if (!cap || cap <= 0) {
            setStatus({ type: "error", message: "Capacity must be a positive number." });
            return;
        }

        setLoading(true);
        try {
            const res = await API.post("/rooms", {
                roomNo: form.roomNo.trim(),
                capacity: cap,
                hasAC: form.hasAC,
                hasAttachedWashroom: form.hasAttachedWashroom,
            });
            setStatus({ type: "success", message: res.data.message || "Room added!" });
            setForm({ roomNo: "", capacity: "", hasAC: false, hasAttachedWashroom: false });
        } catch (err) {
            const msg = err.response?.data?.error || "Failed to add room.";
            setStatus({ type: "error", message: msg });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-lg mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Add New Room</h1>
                <p className="mt-2 text-gray-500">Register a new hostel room to the system.</p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5 shadow-sm"
            >
                <div>
                    <label htmlFor="roomNo" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Room Number
                    </label>
                    <input
                        id="roomNo"
                        name="roomNo"
                        value={form.roomNo}
                        onChange={handleChange}
                        placeholder="e.g. A-101"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>

                <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Capacity (max students)
                    </label>
                    <select
                        id="capacity"
                        name="capacity"
                        value={form.capacity}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                    >
                        <option value="">Select Capacity</option>
                        <option value="1">1-Seater</option>
                        <option value="2">2-Seater</option>
                        <option value="3">3-Seater</option>
                        <option value="4">4-Seater</option>
                        <option value="5">5-Seater</option>
                        <option value="6">6-Seater</option>
                    </select>
                </div>

                <div className="flex gap-6 pt-1">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                name="hasAC"
                                checked={form.hasAC}
                                onChange={handleChange}
                                className="peer sr-only"
                            />
                            <div className="w-11 h-6 rounded-full bg-gray-200 peer-checked:bg-indigo-500 transition-colors" />
                            <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform peer-checked:translate-x-5" />
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">AC</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                name="hasAttachedWashroom"
                                checked={form.hasAttachedWashroom}
                                onChange={handleChange}
                                className="peer sr-only"
                            />
                            <div className="w-11 h-6 rounded-full bg-gray-200 peer-checked:bg-indigo-500 transition-colors" />
                            <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform peer-checked:translate-x-5" />
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Attached Washroom</span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            Adding…
                        </span>
                    ) : (
                        "Add Room"
                    )}
                </button>

                {status && (
                    <div
                        className={`rounded-xl px-4 py-3 text-sm font-medium ${status.type === "success"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                    >
                        {status.message}
                    </div>
                )}
            </form>
        </div>
    );
}
