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
                Forgot Password
            </div>
        );
    }
}

export default ForgotPasswordForm;