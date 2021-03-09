import React from "react"

function Signup() {
    return (
        <div className="page">
            <nav>
                <h1 class="title">MemeMe</h1>
            </nav>
            <section class="form">
                {/* action to be decided */}
                <form>
                    <h2>Sign Up</h2>
                    <input type="text" name="username" placeholder="Username" /> 
                    <input type="email" name="email" placeholder="E-mail Address" />
                    <input type="password" name="password" placeholder="Password" />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" />
                    <input type="button" class="button green" value="Login"/>
                </form>
                <p>Already registered? <a className="link" href="#">Sign in</a></p>
            </section>
        </div>
    )
}

export default Signup