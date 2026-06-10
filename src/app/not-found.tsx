import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex w-full max-w-3xl flex-col items-center gap-6 rounded-2xl bg-white px-16 py-32 text-center dark:bg-zinc-100">
                <Image
                    src="/404-not-found.png"
                    alt="Not Found"
                    width={446}
                    height={190}
                    priority
                />

                <h1 className="text-3xl font-bold text-slate-900 dark:text-black">
                    This page does not exist
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-400">
                    The playlist or page you are looking for was not found.
                </p>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/library"
                        className="rounded bg-gray-700 px-4 py-2 text-white transition hover:bg-gray-800"
                    >
                        Go to Library
                    </Link>

                    <Link
                        href="/"
                        className="rounded bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
                    >
                        Go Home
                    </Link>
                </div>
            </main>
        </div>
    );
}