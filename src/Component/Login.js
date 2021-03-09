import React from "react"

function Login() {
    return (
        <div className="page">
            <nav>
                <h1 class="title">MemeMe</h1>
            </nav>
            <section class="form">
                {/* action to be decided */}
                <form>
                    <h2>Login</h2>
                    <input type="email" name="email" placeholder="E-mail Address" />
                    <input type="password" name="password" placeholder="Password" />
                    <input type="button" class="button green" value="Login"/>
                </form>
                <p>Not a member? <a className="link" href="#">Sign Up</a></p>
            </section>
        </div>
    )
}

export default Login