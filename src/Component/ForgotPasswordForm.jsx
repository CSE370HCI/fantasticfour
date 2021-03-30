import React from "react";
import "../App.css";

class ForgotPasswordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          profile_picture: "",
          username: "",
          email: ""
        };
        this.forgotPasswordForm = React.createRef();
    }


    render() {
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
}

export default ForgotPasswordForm;