import React from "react";
import "../App.css";

class ForgotPasswordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          email: "",
          tokensent: false
        };
    }


    render() {
        if (!this.state.tokensent) {
            return (
                <div>
                    <h1>Forgot your password?</h1>
                    <p>Enter your e-mail to reset your password</p>
                    <form onSubmit={this.submitHandler}>
                        <label>
                            E-mail
                            <input type="email"/>
                        </label>
                        <br/>
                        <input type="submit" value="Reset Password"/>
                    </form>
                </div>
            );
        }
        else {
            return (
                <div>
                    <h1>Reset Password</h1>
                    <form onSubmit={this.submitHandler}>
                        <label>
                            Enter new password
                            <input type="password" name="password"/>
                        </label>
                        <br/>
                        <label>
                            Confirm new password
                            <input type="password" name="confirmPassword"/>
                        </label>
                        <br/>
                        <input type="submit" value="Create New Password"/>
                    </form>
                </div>
            )
        }
        
    }
}

export default ForgotPasswordForm;