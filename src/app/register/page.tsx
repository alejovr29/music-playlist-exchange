"use client";

import { useState } from "react"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitStatus("loading")

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus("success")
                // Limpiar formulario si quieres
                setName("")
                setEmail("")
                setPassword("")

                // Ocultar mensaje después de 3 segundos
                setTimeout(() => setSubmitStatus("idle"), 5000)
            } else {
                setSubmitStatus("error")
                setTimeout(() => setSubmitStatus("idle"), 5000)
            }
        } catch (error) {
            setSubmitStatus("error")
            setTimeout(() => setSubmitStatus("idle"), 5000)
        }
    }

    return (
        <main className="m-auto max-w-md p-4">
            <h1 className="text-3xl font-bold underline mb-6">Register</h1>

            <div className="bg-slate-700 p-6 rounded border-amber-50 border-2">

                <form className='w-full space-y-4' onSubmit={handleSubmit}>
                    {/* Tus campos aquí... */}
                    <div>
                        <label>Name</label>
                        <input
                            className='bg-slate-500 w-full border p-2 rounded'
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Email</label>
                        <input
                            className='bg-slate-500 w-full border p-2 rounded peer'
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <p className="hidden peer-invalid:block text-red-500 text-sm mt-1">
                            Please provide a valid email address.
                        </p>
                    </div>

                    <div>
                        <label>Password</label>
                        <input
                            className='bg-slate-500 w-full border p-2 rounded'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitStatus === "loading"}
                        className="bg-sky-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
                    >
                        {submitStatus === "loading" ? "Creating..." : "Create Account"}
                    </button>
                </form>

                {/* Mensaje de confirmación con Tailwind + estado */}
                {submitStatus === "success" && (
                    <div className="mt-8 mb-4 p-3 bg-green-500 text-black rounded text-center transition-all">
                        ✅ Account created successfully!
                    </div>
                )}

                {submitStatus === "error" && (
                    <div className="mt-8 mb-4 p-3 bg-red-500 text-black rounded text-center transition-all">
                        ❌ Error creating account. Please try again.
                    </div>
                )}

                {submitStatus === "loading" && (
                    <div className="mt-8 mb-4 p-3 bg-blue-500 text-black rounded text-center transition-all">
                        ⏳ Creating account...
                    </div>
                )}
            </div>
        </main>
    )
}