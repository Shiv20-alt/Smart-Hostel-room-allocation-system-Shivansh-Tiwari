import { useEffect, useState } from "react";
import API from "../services/api.js";

export default function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ capacity: "", ac: "", washroom: "" });
    const [expandedRoom, setExpandedRoom] = useState(null);
    const [allocations, setAllocations] = useState([]);
    const [allocLoading, setAllocLoading] = useState(false);

    async function fetchRooms() {
        setLoading(true);
        try {
            const params = {};
            if (filters.capacity) params.capacity = filters.capacity;
            if (filters.ac) params.ac = filters.ac;
            if (filters.washroom) params.washroom = filters.washroom;
            const res = await API.get("/rooms", { params });
            setRooms(res.data);
        } catch {
            setRooms([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRooms();
    }, []);

    function handleFilterChange(e) {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    }

    function handleSearch(e) {
        e.preventDefault();
        fetchRooms();
    }

    function handleReset() {
        setFilters({ capacity: "", ac: "", washroom: "" });
        setTimeout(fetchRooms, 0);
    }

    async function handleDelete(id) {
        if (!confirm("Delete this room?")) return;
        try {
            await API.delete(`/rooms/${id}`);
            if (expandedRoom === id) setExpandedRoom(null);
            fetchRooms();
        } catch {
            alert("Failed to delete room.");
        }
    }

    async function toggleExpand(roomId) {
        if (expandedRoom === roomId) {
            setExpandedRoom(null);
            setAllocations([]);
            return;
        }
        setExpandedRoom(roomId);
        setAllocLoading(true);
        try {
            const res = await API.get(`/allocations/room/${roomId}`);
            setAllocations(res.data);
        } catch {
            setAllocations([]);
        } finally {
            setAllocLoading(false);
        }
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Room Inventory</h1>
                <p className="mt-2 text-gray-500">Click a room to see allocated students.</p>
            </div>

            {/* Filters */}
            <form
                onSubmit={handleSearch}
                className="rounded-2xl border border-gray-200 bg-white p-5 mb-6 shadow-sm"
            >
                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[140px]">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Min Capacity</label>
                        <input
                            name="capacity"
                            type="number"
                            min="1"
                            value={filters.capacity}
                            onChange={handleFilterChange}
                            placeholder="Any"
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <div className="min-w-[120px]">
                        <label className="block text-xs font-medium text-gray-500 mb-1">AC</label>
                        <select
                            name="ac"
                            value={filters.ac}
                            onChange={handleFilterChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 transition-all"
                        >
                            <option value="">Any</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div className="min-w-[120px]">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Washroom</label>
                        <select
                            name="washroom"
                            value={filters.washroom}
                            onChange={handleFilterChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 transition-all"
                        >
                            <option value="">Any</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-500 text-sm hover:text-gray-700 hover:border-gray-400 transition-colors cursor-pointer"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </form>

            {/* Table */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <div className="text-4xl mb-3">🏠</div>
                        <p className="font-medium text-gray-500">No rooms found</p>
                        <p className="text-sm mt-1">Try adjusting filters or add new rooms.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room No</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacity</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">AC</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Washroom</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room) => (
                                    <>
                                        <tr
                                            key={room._id}
                                            onClick={() => toggleExpand(room._id)}
                                            className={`border-b border-gray-50 cursor-pointer transition-colors ${expandedRoom === room._id
                                                ? "bg-indigo-50"
                                                : "hover:bg-gray-50"
                                                }`}
                                        >
                                            <td className="px-5 py-3.5 font-semibold text-gray-900">
                                                <span className="flex items-center gap-2">
                                                    <span className={`text-xs transition-transform ${expandedRoom === room._id ? "rotate-90" : ""}`}>▶</span>
                                                    {room.roomNo}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 px-2.5 py-0.5 text-xs font-medium">
                                                        {room.capacity} beds
                                                    </span>
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${(room.occupied || 0) >= room.capacity
                                                            ? "bg-red-50 text-red-600"
                                                            : (room.occupied || 0) > 0
                                                                ? "bg-amber-50 text-amber-700"
                                                                : "bg-emerald-50 text-emerald-700"
                                                        }`}>
                                                        {room.occupied || 0}/{room.capacity} occupied
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {room.hasAC ? (
                                                    <span className="text-emerald-600 text-xs font-medium">✓ Yes</span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">✗ No</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {room.hasAttachedWashroom ? (
                                                    <span className="text-emerald-600 text-xs font-medium">✓ Yes</span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">✗ No</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(room._id); }}
                                                    className="text-xs text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                        {/* Expanded allocation details */}
                                        {expandedRoom === room._id && (
                                            <tr key={`${room._id}-alloc`}>
                                                <td colSpan="5" className="px-5 py-0">
                                                    <div className="py-4 pl-8 border-l-2 border-indigo-200 ml-2">
                                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                                            Allocated Students
                                                        </h4>
                                                        {allocLoading ? (
                                                            <p className="text-sm text-gray-400">Loading...</p>
                                                        ) : allocations.length === 0 ? (
                                                            <p className="text-sm text-gray-400 italic">No students allocated to this room yet.</p>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {allocations.map((alloc) => (
                                                                    <div
                                                                        key={alloc._id}
                                                                        className="flex items-center gap-4 rounded-lg bg-white border border-gray-100 px-4 py-2.5 shadow-sm"
                                                                    >
                                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                                                            {alloc.studentName?.charAt(0)?.toUpperCase() || "?"}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <p className="text-sm font-medium text-gray-900">{alloc.studentName}</p>
                                                                            <p className="text-xs text-gray-500">Roll: {alloc.studentNumber}</p>
                                                                        </div>
                                                                        <div className="text-xs text-gray-400">
                                                                            {new Date(alloc.allocatedAt).toLocaleDateString()}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {!loading && rooms.length > 0 && (
                <p className="mt-4 text-xs text-gray-400 text-right">
                    Showing {rooms.length} room{rooms.length !== 1 ? "s" : ""}
                </p>
            )}
        </div>
    );
}
