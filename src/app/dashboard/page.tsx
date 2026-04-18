"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <p className="p-4">Loading dashboard...</p>;
    }

    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-4">
                Dashboard
            </h1>

            <div className="bg-slate-700 p-4 rounded">
                <p>Welcome {session?.user?.name} 👋</p>
                <p><strong>Email:</strong> {session?.user?.email}</p>

                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="mt-4 bg-red-500 px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>
        </main>
    );
}