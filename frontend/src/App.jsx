import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AddRoom from "./pages/AddRoom.jsx";
import RoomList from "./pages/RoomList.jsx";
import AllocateRoom from "./pages/AllocateRoom.jsx";

export default function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                    <Route path="/" element={<Navigate to="/rooms" replace />} />
                    <Route path="/rooms" element={<RoomList />} />
                    <Route path="/add-room" element={<AddRoom />} />
                    <Route path="/allocate" element={<AllocateRoom />} />
                </Routes>
            </main>
        </div>
    );
}
