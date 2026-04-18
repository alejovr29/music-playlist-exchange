"use client";

import { signIn } from "next-auth/react";
import { useState } from "react"

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [touched, setTouched] = useState({
        email: false,
        password: false,
    })

    const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

    {/* Form submission handler that connects to the API */ }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitStatus("loading")

        try {
            // The following was the old version of manual DB connection, it is not used anymore as NextAuth.JS was implemented:
            // const response = await fetch("/api/login", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ email, password })
            // });
            

            // const data = await response.json();

            const response = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (response?.ok) {
                setSubmitStatus("success")
                // Clear form fields
                setEmail("")
                setPassword("")
                setTouched({
                    email: false,
                    password: false,
                })

                // Hide success message after 5 seconds
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

    {/* Form validations using regex and lenght checks */ }

    let showEmailError = touched.email && emailRegex.test(email) === false;
    let showPasswordError = touched.password && password.trim() == "";


    {/* Checks if everything is valid and enable Submit button */ }
    const isFormValid =
        email.trim() !== "" && emailRegex.test(email) &&
        password.trim() !== "";

    return (
        <main className="m-auto max-w-md p-4">
            <h1 className="text-3xl font-bold underline mb-6">Welcome Back</h1>

            <div className="bg-slate-700 p-6 rounded border-amber-50 border-2">

                <form className='w-full space-y-4' onSubmit={handleSubmit}>

                    <div>
                        <label>Email</label>
                        <input
                            className={`bg-slate-500 w-full border p-2 rounded ${showEmailError
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-300"
                                }`}
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                            required
                        />
                        {showEmailError && (
                            <p className=" text-red-500 text-sm mt-1">
                                Please enter a valid email address.
                            </p>
                        )}
                    </div>

                    <div>
                        <label>Password</label>
                        <input
                            className={`bg-slate-500 w-full border p-2 rounded ${showPasswordError
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-300"
                                }`}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                            required
                        />

                        {showPasswordError && (
                            <p className=" text-red-500 text-sm mt-1">
                                Please enter your password.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitStatus === "loading" || !isFormValid}
                        className="bg-sky-500 hover:bg-violet-600 text-white font-bold mt-2 py-2 px-4 rounded w-full disabled:opacity-50"
                    >
                        {submitStatus === "loading" ? "Loggin in..." : "Login"}
                    </button>
                </form>

                {/* Confirmation message */}
                {
                    submitStatus === "success" && (
                        <div className="mt-8 mb-4 p-3 bg-green-500 text-black rounded text-center transition-all">
                            ✅ Logged in successfully!
                        </div>
                    )
                }

                {
                    submitStatus === "error" && (
                        <div className="mt-8 mb-4 p-3 bg-red-500 text-black rounded text-center transition-all">
                            ❌ Error finding account. Please try again.
                        </div>
                    )
                }

                {
                    submitStatus === "loading" && (
                        <div className="mt-8 mb-4 p-3 bg-blue-500 text-black rounded text-center transition-all">
                            ⏳ Login account...
                        </div>
                    )
                }
            </div >
        </main >
    )
}