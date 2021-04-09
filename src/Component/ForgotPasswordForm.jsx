import React from "react";
import {Link} from 'react-router-dom';

import "../App.css";
import "./styles/ForgotPasswordForm.css";

class ForgotPasswordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          email: "",
          password: "",
          resettoken: "",
          sessiontoken: "",
          tokensent: false,
          passwordmismatch: true,
          resetSuccessful: false
        };
    }

    emailChangeHandler = event => {
        this.setState({
          email: event.target.value
        });
    }

    tokenChangeHandler = event => {
        this.setState({
            resettoken: event.target.value
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
            fetch(process.env.REACT_APP_API_PATH+"/auth/request-reset", {
                method: "post",
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: this.state.email
                })
            })
            .then(res => res.status)
            .then(result => {
                //console.log(result);
                if (result == 200) {
                    // toggle tokensent
                    this.toggleTokenSent();
                }
            },
            error => {
                alert("Error requesting token.")
            });
        }
        // after sending reset email
        else {
            // continue only if passwords match
            if (this.state.passwordmismatch) {
                return;
            }

            // call API with token
            fetch(process.env.REACT_APP_API_PATH+"/auth/reset-password", {
                method: "post",
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  token: this.state.resettoken,
                  password: this.state.password
                })
            })
            .then(res => res.status)
            .then(result => {
                // if reset succesful, navigate to login page
                if (result == 200) {
                    this.setState({
                        resetSuccessful: true
                    });
                }
                else if (result == 401) {
                    alert("Oops, invalid token, please try again!");
                }
            }, error => {
                alert("Could not reset password. Try resetting again.");
            });
        }
    }

    toggleTokenSent = () => {
        this.setState({
            tokensent: !this.state.tokensent
        });
    }

    render() {
        // before token is sent, ask the user for email address
        if (!this.state.tokensent) {
            return (
                <div>
                    <p>Enter your e-mail to reset your password</p>
                    <form onSubmit={this.submitHandler}>
                        <label>
                            E-mail
                            <input type="email" onChange={this.emailChangeHandler}/>
                        </label>
                        <br/>
                        <input className="desktop-confirm" type="submit" value="Reset Password"/>
                    </form>
                </div>
            );
        }
        // ask for token and new password 
        else{
            return !this.state.resetSuccessful ? (
                <div>
                    <h1>Reset Password</h1>
                    <form onSubmit={this.submitHandler}>
                        <label>
                            Token
                            <input type="text" name="token" onChange={this.tokenChangeHandler}/>
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
                        <input className="desktop-confirm" type="submit" value="Create New Password"/>
                    </form>
                </div>
            )
            :
            (   // notify user that password reset was successful
                <>
                    <h1>Password reset complete!</h1>
                    <Link to="/login">Go to login.</Link>
                </>
            );
        }
        
    }
}

export default ForgotPasswordForm;