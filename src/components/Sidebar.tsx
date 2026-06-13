"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaMusic, FaCompass } from "react-icons/fa";
import { CiSearch, CiLogout, CiCircleQuestion } from "react-icons/ci";

const Sidebar = () => {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(path);
    };

    const linkClass = (path: string) => {
        const base = "flex items-center gap-4 px-5 py-3 rounded-lg transition-colors text-lg font-semibold";
        return isActive(path)
            ? `${base} bg-sky-400 text-white`
            : `${base} text-gray-300 hover:bg-gray-700`;
    };

    return (
        <aside className="w-64 bg-gray-800/85 border-r-2 border-sky-400 flex flex-col h-screen sticky top-0 px-3">
            {/* Logo Section */}
            <div className="pl-4 py-8 border-b border-gray-600">
                <h1 className="text-3xl font-bold text-white">Music Finder</h1>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 mt-12 overflow-y-auto">
                <ul className="space-y-3">
                    {/* Search */}
                    <li>
                        <Link href="/search" className={linkClass("/search")}>
                            <CiSearch size={24} />
                            <span>Search</span>
                        </Link>
                    </li>

                    {/* Home */}
                    <li>
                        <Link href="/" className={linkClass("/")}>
                            <FaHome size={20} />
                            <span>Home</span>
                        </Link>
                    </li>

                    {/* Library */}
                    <li>
                        <Link href="/library" className={linkClass("/library")}>
                            <FaMusic size={20} />
                            <span>Library</span>
                        </Link>
                    </li>

                    {/* Explore */}
                    <li>
                        <Link href="/explore" className={linkClass("/explore")}>
                            <FaCompass size={20} />
                            <span>Explore</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Profile/Dashboard Section */}
            <div className="pb-8 border-t border-gray-600">
                {/* Profile */}
                <div className="mt-6 mb-3">
                    <Link href="/dashboard" className={linkClass("/dashboard")}>
                        <span className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0">
                            A
                        </span>
                        <span>Profile</span>
                    </Link>
                </div>

                {/* Help and Logout - Same Row */}
                <div className="flex gap-3">

                    <Link
                        href="/api/auth/logout"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-3 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors text-sm font-semibold"
                    >
                        <CiLogout size={20} />
                        <span>Logout</span>
                    </Link>


                    <div className="border-r  border-gray-600" />

                    <Link
                        href="/help"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors text-sm font-semibold "
                    >
                        <CiCircleQuestion size={20} />
                        <span>Help</span>
                    </Link>

                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
