import React from "react";
import "../App.css";

class ForgotPasswordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          email: "",
          password: "",
          resettoken: "",
          sessiontoken: "",
          tokensent: true,
          passwordmismatch: true
        };
    }

    emailChangeHandler = event => {
        this.setState({
          email: event.target.value
        });
    }

    passwordChangeHandler = event => {
        this.setState({
          password: event.target.value
        });
    }

    verifyPassword = (event) => {
        if (this.state.password === event.target.value) {
          this.setState({
            passwordmismatch: false
          });
        }
        else {
          this.setState({
            passwordmismatch: true
          });
        }
    }

    submitHandler = event => {
        // don't submit form
        event.preventDefault();

        // before sending reset email
        if (!this.state.tokensent) {
            // call API with email

            // toggletokensent
        }
        // after sending reset email
        else {
            // continue only if passwords match
            if (this.state.passwordmismatch) {
                return;
            }

            // call API with token
            // toggletokensent
        }
    }
    render() {
        // before token is sent, ask the user for email address
        if (!this.state.tokensent) {
            return (
                <div>
                    <h1>Forgot your password?</h1>
                    <p>Enter your e-mail to reset your password</p>
                    <form onSubmit={this.submitHandler}>
                        <label>
                            E-mail
                            <input type="email" onChange={this.emailChangeHandler}/>
                        </label>
                        <br/>
                        <input type="submit" value="Reset Password"/>
                    </form>
                </div>
            );
        }
        // ask for token and new password 
        else{
            return (
                <div>
                    <h1>Reset Password</h1>
                    <form onSubmit={this.submitHandler}>
                        <label>
                            Token
                            <input type="text" name="token"/>
                        </label>
                        <br/>
                        <label>
                            Enter new password
                            <input type="password" name="password" onChange={this.passwordChangeHandler}/>
                        </label>
                        <br/>
                        <label>
                            Confirm new password
                            <input type="password" name="confirmPassword" onChange={this.verifyPassword}/>
                        </label>
                        <br/>
                        { this.state.passwordmismatch ? <p>Passwords don't match</p> : <></> }
                        <input type="submit" value="Create New Password"/>
                    </form>
                </div>
            )
        }
        
    }
}

export default ForgotPasswordForm;