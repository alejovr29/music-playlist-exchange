import style from "./page.module.css"


export default function RegisterPage() {
    return (
        <main className="main">
            <h1>Register</h1>

            <form className={style.probando}>
                <div>
                    <label>Name</label>
                    <input type="text" />
                </div>

                <div>
                    <label>Email</label>
                    <input type="email" />
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" />
                </div>

                <button type="submit">Create Account</button>
            </form>
        </main>
    )

}