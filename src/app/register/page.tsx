"use client";

import { useState } from "react"

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export default function RegisterPage() {
    const [name, setName] = useState("")
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
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus("success")
                // Clear form fields
                setName("")
                setEmail("")
                setPassword("")

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

    let validEmail = emailRegex.test(email) === true;
    let validPassword = passwordRegex.test(password) === true;

    let showEmailError = touched.email && !validEmail;
    let showPasswordError = touched.password && !validPassword;


    {/* Checks if everything is valid and enable Submit button */ }
    const isFormValid =
        name.trim() !== "" &&
        validEmail &&
        validPassword;

    return (
        <main className="m-auto max-w-md p-4">
            <h1 className="text-3xl font-bold underline mb-6">Register</h1>

            <div className="bg-slate-700 p-6 rounded border-amber-50 border-2">

                <form className='w-full space-y-4' onSubmit={handleSubmit}>
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
                                Please provide a valid email address.
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
                            <div className=" text-red-500 text-sm mt-3 ">
                                <strong>Password must be at least:</strong>

                                <ul>
                                    <li>- 8 characters long.</li>
                                    <li>- Include at least one uppercase letter.</li>
                                    <li>- Include at least one lowercase letter.</li>
                                    <li>- Include at least one number.</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitStatus === "loading" || !isFormValid}
                        className="bg-sky-500 hover:bg-violet-600 text-white font-bold mt-2 py-2 px-4 rounded w-full disabled:opacity-50"
                    >
                        {submitStatus === "loading" ? "Creating..." : "Create Account"}
                    </button>
                </form>

                {/* Confirmation message */}
                {
                    submitStatus === "success" && (
                        <div className="mt-8 mb-4 p-3 bg-green-500 text-black rounded text-center transition-all">
                            ✅ Account created successfully!
                        </div>
                    )
                }

                {
                    submitStatus === "error" && (
                        <div className="mt-8 mb-4 p-3 bg-red-500 text-black rounded text-center transition-all">
                            ❌ Error creating account. Please try again.
                        </div>
                    )
                }

                {
                    submitStatus === "loading" && (
                        <div className="mt-8 mb-4 p-3 bg-blue-500 text-black rounded text-center transition-all">
                            ⏳ Creating account...
                        </div>
                    )
                }
            </div >
        </main >
    )
}