import React from "react";
import "../App.css";
import "./styles/EditSettings.css";
import Modal from "./Modal.jsx";
import {Link} from 'react-router-dom';

export default class EditSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      get_username: "",
      get_email: "",
      username: "",
      email: "",
      no_changes_made: false,
      is_password_mismatch: false,
      is_username_taken: false,
      is_email_taken: false,
        changes_made_success: false
    };
    this.fieldChangeHandler.bind(this);
  }

  fieldChangeHandler(field, e) {
    this.setState({
      [field]: e.target.value,
        no_changes_made: false,
        is_password_mismatch: false,
        is_username_taken: false,
        is_email_taken: false,
        changes_made_success: false,
    });
  }

  componentDidMount() {
    // first fetch the user data to allow update of username
    fetch(process.env.REACT_APP_API_PATH+"/users/"+sessionStorage.getItem("user"), {
      method: "get",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(
        result => {
          if (result) {
            this.setState({
              username: result.username || "",
              email: result.email || "",
              get_username: result.username || "",
              get_email: result.email || "",
            });
          }
        }
      );
  }

  editUsername() {
      fetch(process.env.REACT_APP_API_PATH+ "/users?username=" + this.state.username, {
          method: "GET",
          headers: {
              'Content-Type': 'application/json',
          },
      })
          .then(res => res.json())
          .then(
              result => {
                  if (result[1] != 0 && this.state.username != this.state.get_username) {
                      this.setState({
                          is_username_taken: true,
                      });
                  }
                  else {
                      fetch(process.env.REACT_APP_API_PATH+ "/users/" + sessionStorage.getItem("user"), {
                          method: "PATCH",
                          headers: {
                              'Content-Type': 'application/json',
                              'Authorization': 'Bearer '+ sessionStorage.getItem("token")
                          },
                          body: JSON.stringify({
                              username: this.state.username
                          })
                      })
                          .then(() => {
                              this.setState({
                                  changes_made_success: true,
                                  get_username: this.state.username,
                                  get_email: this.state.email,
                              });
                          })
                  }
              }
          );
  }

  editEmail() {
    fetch(process.env.REACT_APP_API_PATH+ "/users?email=" + this.state.email, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => res.json())
        .then(
            result => {
                if (result[1] != 0 && this.state.email != this.state.get_email) {
                    this.setState({
                        is_email_taken: true,
                    });
                }
                else {
                    fetch(process.env.REACT_APP_API_PATH+ "/users/" + sessionStorage.getItem("user"), {
                        method: "PATCH",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer '+ sessionStorage.getItem("token")
                        },
                        body: JSON.stringify({
                            email: this.state.email
                        })
                    })
                        .then(() => {
                            this.setState({
                                changes_made_success: true,
                                get_username: this.state.username,
                                get_email: this.state.email,
                            });
                        })
                }
            }
        );
  }

  submitHandler = event => {
      event.preventDefault();
      this.setState({
          no_changes_made: false,
          is_password_mismatch: false,
          is_username_taken: false,
          is_email_taken: false,
          changes_made_success: false,
      });
      if ((this.state.username == "" && this.state.email == "") ||
          (this.state.username == this.state.get_username && this.state.email == this.state.get_email)){
          this.setState({
              no_changes_made: true
          });
          return;
      }
      if(this.state.username != this.state.get_username && this.state.username.length > 0) {
          this.editUsername()
      }
      if(this.state.email != this.state.get_email && this.state.email.length > 0) {
          this.editEmail()
      }
  };

    toDeleteAccount = () => {
        window.location.href = "delete";
    };

    toResetPassword = () => {
        window.location.href = "forgot-password";
    }

  render() {
      return(
          <form onSubmit={this.submitHandler} style={{'font-size': '15px'}}>
              <br/>
              {
                  this.state.changes_made_success ? (
                      <p className="success-message">✔ Changes made successfully!</p>
                  ) : ""
              }
              {
                  this.state.no_changes_made ? (
                      <p className="error-message">⚠ You did not make any changes!</p>
                  ) : ""
              }
              <br/>
              <label>Username</label>
              <input
                  defaultValue={this.state.username}
                  type="text"
                  onChange={e => this.fieldChangeHandler("username", e)}
                  value={this.state.username}
              />
              {
                  this.state.is_username_taken ? (
                      <p className="error-message">⚠ Username already taken!</p>
                  ) : ""
              }
              <br/><br/>
              <label>Email Address</label>
              <input
                  defaultValue={this.state.email}
                  type="text"
                  onChange={e => this.fieldChangeHandler("email", e)}
                  value={this.state.email}
              />
              {
                  this.state.is_email_taken ? (
                      <p className="error-message">⚠ Email already taken!</p>
                  ) : ""
              }
              <br/>
              <br/>
              <a onClick={this.toResetPassword}className="text-link">Reset Password</a>
              <br/>
              <input className="desktop-confirm" type="submit" value="Confirm" />
              <br/>
              <input
                  className="desktop-delete distancedbutton"
                  type="button"
                  onClick={this.toDeleteAccount}
                  value="Delete Account"
              />
          </form>
      );
  }
}
