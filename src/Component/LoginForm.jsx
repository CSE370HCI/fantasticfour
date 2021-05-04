import React from "react";
import {Link} from 'react-router-dom';

import "../App.css";
import "./styles/LoginForm.css"

// the login form will display if there is no session token stored.  This will display
// the login form, and call the API to authenticate the user and store the token in
// the session.

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      alanmessage: "",
      sessiontoken: "",
      signup: false,
      passwordmismatch: false,
      usernameexists: false,
      is_invalid_login: false,
      is_deleted_account: false
    };
    this.refreshPostsFromLogin = this.refreshPostsFromLogin.bind(this);
  }

  // once a user has successfully logged in, we want to refresh the post
  // listing that is displayed.  To do that, we'll call the callback passed in
  // from the parent.
  refreshPostsFromLogin(){
    this.props.refreshPosts();
  }

  // change handlers keep the state current with the values as you type them, so
  // the submit handler can read from the state to hit the API layer
  myChangeHandler = event => {
    this.setState({
      username: event.target.value
    });
  };

  emailChangeHandler = event => {
    this.setState({
      email: event.target.value
    });
  }

  passwordChangeHandler = event => {
    this.setState({
      password: event.target.value
    });
  };

  toggleSignup = () => {
    this.setState({
      signup: !this.state.signup
    });
  }

  checkUsername = () => {
    
  }

  toHome = () => {
    window.location.href = "postinglist";
  };

  // when the user hits submit, process the login through the API
  submitHandler = event => {
    //keep the form from actually submitting
    event.preventDefault();

      this.setState({
          is_invalid_login: false,
          is_deleted_account: false
      });

    if (this.state.username) {
      // Check username availability;
      fetch(process.env.REACT_APP_API_PATH + "/users?username=" + this.state.username, {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          },
      })
      .then((res) => res.json())
      .then((result) => {
          if (result[1] != 0) {
              console.log("This username already exists!");
              this.setState({
                  usernameexists: true
              });
          }
          else {
              this.setState({
                  usernameexists: false
              });
          }
      })
    }

    if (this.state.signup && !this.state.passwordmismatch && !this.state.usernameexists) {
      // make the API call in order to signup
      fetch(process.env.REACT_APP_API_PATH+"/auth/signup", {
        method: "post",
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        })
      })
      // sign up continues here
      .then(res => res.json())
      .then(result => {
        if (result.userID) {
          // set the auth token and user ID in the session state
          sessionStorage.setItem("token", result.token);
          sessionStorage.setItem("user", result.userID);
          this.setState({
              sessiontoken: result.token,
              alanmessage: result.token
          });

          // add the username to the user account provided during signup
          return fetch(process.env.REACT_APP_API_PATH+`/users/${result.userID}`, {
            method: "PATCH",
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${result.token}`
            },
            body: JSON.stringify({
              username: this.state.username
            })
          })
        }
        else {
          // if the login failed, remove any infomation from the session state
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("username");
          this.setState({
              sessiontoken: "",
              alanmessage: result.message
          });
        }
      })
      .then(res => res.json())
      .then(result => {
        console.log("signup user id: ", result.id)

        // set default profile picture for user
        return fetch(process.env.REACT_APP_API_PATH+"/user-artifacts", {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+ sessionStorage.getItem("token")
          },
          body: JSON.stringify({
              ownerID: result.id,
              type: "image",
              //Sets default profile picture. User can change it in their profile settings
              url: "https://i.imgur.com/UJ9uaCg.png",
              category: "profile_picture"
          })
        })
      })
      .then(res => {
        if (res.status === 201) {
          console.log("profile picture uploaded")
          sessionStorage.setItem("username", res.username);
          this.toHome()
        }
      })
    }
    // not in signup mode
    // login happens here
    else if (!this.state.signup) {
      // make the api call to the login page
      fetch(process.env.REACT_APP_API_PATH+"/auth/login", {
        method: "post",
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        })
      })
      .then(res => res.json())
      .then(result => {
        if (result.userID) {
          this.setState({
              sessiontoken: result.token,
              alanmessage: result.userID
          });

          // check if disabled user
          return fetch(process.env.REACT_APP_API_PATH+"/users?email=" + this.state.email, {
              method: "GET",
              headers: {
              'Content-Type': 'application/json',
              }
          });
        }
        else {
          // if the login failed, remove any infomation from the session state
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("username");
          this.setState({
              sessiontoken: "",
              alanmessage: result.message
          });
          return
        }
      })
      .then(res => res.json())
      .then(
        result => {
          if (result[0][0]["status"] == "DELETED") {
            this.setState({
                is_deleted_account: true,
            });
            return
          }
          else {
            // set the auth token and user ID in the session state
            sessionStorage.setItem("token", this.state.sessiontoken);
            sessionStorage.setItem("user", result[0][0].id);
            sessionStorage.setItem("username", result[0][0].username);
            this.setState({
            sessiontoken: this.state.sessiontoken,
            alanmessage: this.state.sessiontoken
            });

            // call refresh on the posting list
            this.toHome();
            return
          }
        },
        error => {
          this.setState({
              is_invalid_login: true
          });
          console.log(error);
      })
    }
  }

  verifyPassword = (event) => {
      if (this.state.password.length == 0 || event.target.value.length == 0) {
          this.setState({
              passwordmismatch: false
          });
      }
    else if (this.state.password === event.target.value) {
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

  render() {
    // console.log("Rendering login, token is " + sessionStorage.getItem("token"));

    if (!sessionStorage.getItem("token")) {
      return (
        <div className="temp-login-form">
          <form onSubmit={this.submitHandler}>
              {
                  this.state.is_invalid_login ?
                      <p className="error-message">⚠ Invalid username or password</p>
                      :
                      ""
              }
              {
                  this.state.is_deleted_account ?
                      <p className="error-message">⚠ This account has been deleted</p>
                      :
                      ""
              }
              <br/>
            <label>
              Email
              <input type="email" onChange={this.emailChangeHandler} />
            </label>

            { // if in signup state, display the username input
              this.state.signup ?
              (
                <label>
                  Username
                  <input type="text" onChange={this.myChangeHandler} />
                  {
                    this.state.usernameexists ? (
                        <p className="error-message">⚠ Username already exists!</p>
                    ) : ""
                  }
                  <br/>
                
                </label>
              ) : ""
            }

            <label>
              Password
              <input type="password" onChange={this.passwordChangeHandler} />
              {!this.state.signup ? <Link to="/forgot-password" className="text-link">Forgot password?</Link> : ""}
            </label>

            {
              this.state.signup ?
              (
                <label>
                  Confirm Password
                  <input type="password" onChange={this.verifyPassword} />

                  {
                  this.state.passwordmismatch ?
                    <p className="error-message">⚠ Passwords don't match</p>
                    :
                    ""
                  }
                  <br/>
                </label>
              ) : ""
            }

            <input className="desktop-confirm" type="submit" value="Submit" />

            {
              this.state.signup ?
              (
                <p>Already registered? <span className="text-link" href="#" onClick={this.toggleSignup}>Sign in</span></p>
              )
              :
              (
                <p>Not a member? <span className="text-link" href="#" onClick={this.toggleSignup}>Sign Up</span></p>
              )

            }
            <p>{this.state.alanmessage}</p>
          </form>
        </div>
      );
    } else {
      return <div className="page-template"> Logged in!</div>
    }
  }
}
