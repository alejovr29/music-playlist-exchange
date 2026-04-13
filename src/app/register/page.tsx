"use client";

import { useState } from "react"


export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Aquí puedes agregar la lógica para enviar los datos al servidor o realizar validaciones
        const response = await fetch("/api/register", {
            method: "POST",
            headers: { contentType: "application/json" },
            body: JSON.stringify(
                { name, email, password }
            )
        });

        const data = await response.json();
        console.log("Response from server:", data);
    }




    return (
        <main className="m-auto auto">
            <h1 className="text-3xl font-bold underline">Register</h1>

            <div className=" bg-slate-700 pt-10 pb-10 p-15 rounded border-amber-50 border-2">
                <form className='w-50 max-w-90 space-y-10' onSubmit={handleSubmit}>
                    <div>
                        <label>Name</label>
                        <input className='bg-slate-500 w-full border p-2 rounded' type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                        <label>Email</label>
                        <input className='bg-slate-500 peer ... w-full border p-2 rounded' type="email" placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <p className="hidden, peer-invalid:block pt-5 px-auto text-red-500">Please provide a valid email address.</p>
                    </div>

                    <div>
                        <label>Password</label>
                        <input className='bg-slate-500 required focus:border-sky-500 focus:outline focus:outline-sky-800 w-full border p-2 rounded' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <button type="submit" className="bg-sky-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded w-full">
                        Create Account
                    </button>
                </form>
            </div>
        </main>
    )

}