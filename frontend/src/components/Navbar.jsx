import { NavLink } from "react-router-dom";

const links = [
    { to: "/rooms", label: "Rooms", icon: "" },
    { to: "/add-room", label: "Add Room", icon: "" },
    { to: "/allocate", label: "Allocate", icon: "" },
];

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            S
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                            SHR<span className="text-indigo-600">AS</span>
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-1">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive
                                        ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                    }`
                                }
                            >
                                <span>{link.icon}</span>
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
