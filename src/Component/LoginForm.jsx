import React from "react";

import "../App.css";

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
      passwordmismatch: true
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

  // when the user hits submit, process the login through the API
  submitHandler = event => {
    //keep the form from actually submitting
    event.preventDefault();

    // in signup mode
    if (this.state.signup) {
      // make the api call to the signup page
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
      .then(res => res.json())
      .then(result => {
        if (result.userID) {
          // set the auth token and user ID in the session state
          sessionStorage.setItem("token", result.token);
          sessionStorage.setItem("user", result.id);

          this.setState({
            sessiontoken: result.token,
            alanmessage: result.token
          });

          // add the username to the user account provided during signup
          fetch(process.env.REACT_APP_API_PATH+`/users/${result.userID}`, {
            method: "PATCH",
            headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${result.token}`
            },
            body: JSON.stringify({
              username: this.state.username
            })
          })
          .then(res => res.json())
          .then(result => {

            console.log("UserID: " + result.id);

            // set default profile picture for user
            fetch(process.env.REACT_APP_API_PATH+"/user-artifacts", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.sessiontoken}`
              },
              body: JSON.stringify({
                ownerID: result.id,
                type: "image",
                //Sets default profile picture. User can change it in their profile settings
                url: "https://imgur.com/a/rAAHLMu",
                category: "profile_picture"
              })
            })
            .then(res => {
              // call refresh on the posting list
              this.refreshPostsFromLogin();
            }
            );
          }, error => {
            console.log("after signup error: ", error);
          });
        } else {
          // if the login failed, remove any infomation from the session state
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          this.setState({
            sessiontoken: "",
            alanmessage: result.message
          });
        }
      },
      error => {
        alert(error);
      });
    }
    else {
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
        .then(
          result => {
            if (result.userID) {
              // check if disabled user
              return fetch(process.env.REACT_APP_API_PATH+"/users?email=" + this.state.email, {
                method: "GET",
                headers: {
                  'Content-Type': 'application/json',
                }
              });
            } else {

              // if the login failed, remove any infomation from the session state
              sessionStorage.removeItem("token");
              sessionStorage.removeItem("user");
              this.setState({
                sessiontoken: "",
                alanmessage: result.message
              });
            }
          },
          error => {
            alert("error!");
          }
        )
        .then(res => res.json())
        .then(result => {
          if (result[0][0]["status"] == "DISABLED") {
            alert("This user's account has been disabled!");
          }
          else {
            // set the auth token and user ID in the session state
            sessionStorage.setItem("token", result.token);
            sessionStorage.setItem("user", result.userID);

            this.setState({
              sessiontoken: result.token,
              alanmessage: result.token
            });

            // call refresh on the posting list
            this.refreshPostsFromLogin();
          }
        },
        error => {
          alert("Error retrieving account");
          console.log(error);
        });
      }
  };

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

  render() {
    // console.log("Rendering login, token is " + sessionStorage.getItem("token"));

    if (!sessionStorage.getItem("token")) {
      return (
        <div className="temp-login-form">
          <form onSubmit={this.submitHandler}>
            <label>
              Email
              <input type="email" onChange={this.emailChangeHandler} />
            </label>
            <br />

            { // if in signup state, display the email input
              this.state.signup ?
              (
                <label>
                  Username
                  <input type="text" onChange={this.myChangeHandler} />
                  <br/>
                </label>
              ) : ""
            }

            <label>
              Password
              <input type="password" onChange={this.passwordChangeHandler} />
            </label>
            <br />

            {
              this.state.signup ?
              (
                <label>
                  Confirm Password
                  <input type="password" onChange={this.verifyPassword} />
                  <br/>
                  {
                  this.state.passwordmismatch ?
                    <p>Passwords don't match</p>
                    :
                    ""
                  }
                </label>
              ) : ""
            }

            

            <input type="submit" value="submit" />
            {
              this.state.signup ?
              (
                <p>Already registered? <span className="link" href="#" onClick={this.toggleSignup}>Sign in</span></p>
              )
              :
              (
                <p>Not a member? <span className="link" href="#" onClick={this.toggleSignup}>Sign Up</span></p>
              )

            }
            <p>{this.state.alanmessage}</p>
          </form>
        </div>
      );
    } else {
      console.log("Returning welcome message");
      if (this.state.username) {
        return <p>Welcome, {this.state.username}</p>;
      } else {
        return <p>{this.state.alanmessage}</p>;
      }
    }
  }
}
