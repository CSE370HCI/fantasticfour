import React from "react";
import "../App.css";
import Modal from "./Modal.jsx";
import {Link} from 'react-router-dom';

export default class EditSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      confirmpassword: ""
    };
    this.fieldChangeHandler.bind(this);
  }

  fieldChangeHandler(field, e) {
    console.log("field change");
    this.setState({
      [field]: e.target.value
    });
  }

  componentDidMount() {
    console.log("In profile");
    console.log(this.props);

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
            console.log(result);

            this.setState({
              // IMPORTANT!  You need to guard against any of these values being null.  If they are, it will
              // try and make the form component uncontrolled, which plays havoc with react
              username: result.username || "",
              email: result.email || "",
              password: result.password || "",
              confirmpassword: result.confirmpassword || ""
            });
          }
        },
        error => {
          alert("error!");
        }
      );

    //make the api call to the user API to get the user with all of their attached preferences
    fetch(process.env.REACT_APP_API_PATH+"/user-preferences?userID="+sessionStorage.getItem("user"), {
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
            console.log(result);
          }
        },
        error => {
          alert("error!");
        }
      );
  }

  submitHandler = event => {
    //keep the form from actually submitting
    event.preventDefault();
    if (this.state.username == "" || this.state.email == "" || this.state.password == "" || this.state.confirmpassword == ""){
            alert("One or more fields are empty.");
            event.preventDefault();
    }
    if (!this.state.username == "" && (this.state.username.length < 4) || (this.state.username.length > 20)){
            alert("Username must contain 4-20 characters.");
            event.preventDefault();
    }
    if (!this.state.username == "" && this.state.email.length < 5 && (!this.state.email.includes("@") || !this.state.email.includes("."))){
            alert("Please provide a valid email address.");
            event.preventDefault();
    }
    if (this.state.password != this.state.confirmpassword){
        alert("Passwords do not match.");
        event.preventDefault();
    }
    if (!this.state.password == "" && this.state.password.length < 8){
        alert("Password must contain at least 8 characters.");
        event.preventDefault();
    }
    //make the api call to the user controller
    fetch(process.env.REACT_APP_API_PATH+"/users/"+sessionStorage.getItem("user"), {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },
      body: JSON.stringify({

        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
      })
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            responseMessage: result.Status
          });
        },
        error => {
          alert("error!");
        }
      );

    let url = process.env.REACT_APP_API_PATH+"/user-preferences";
    let method = "POST";


    //make the api call to the user prefs controller
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            responseMessage: result.Status
          });
        },
        error => {
          alert("error!");
        }
      );

  };

    redirect = () => {
        window.location.replace("/delete");
    };

  render() {
    return (
    <div id="myModal" className="editProfile">
            <div className="modal-content">
              <span className="close" onClick={this.onClose}>
                &times;
              </span>
              <br/>
              Edit Personal Information
                 <form onSubmit={this.submitHandler} className="profileform" >
                    <br/>
                    <label>
                        Username
                    </label>
                    <br/>
                    <input
                      defaultValue={this.state.username}
                      type="text"
                      onChange={e => this.fieldChangeHandler("username", e)}
                      value={this.state.username}
                    />
                    <br/><br/>
                    <label>
                      Email Address
                    </label>
                    <br/>
                    <input
                      defaultValue={this.state.email}
                      type="text"
                      onChange={e => this.fieldChangeHandler("email", e)}
                      value={this.state.email}
                    />
                    <br/><br/>
                    <label>
                      Password
                    </label>
                    <br/>
                    <input
                      defaultValue={this.state.password}
                      type="password"
                      onChange={e => this.fieldChangeHandler("password", e)}
                      value={this.state.password}
                    />
                    <br/><br/>
                    <label>
                      Confirm Password
                    </label>
                    <br/>
                    <input
                      defaultValue={this.state.password}
                      type="password"
                      onChange={e => this.fieldChangeHandler("confirmpassword", e)}
                      value={this.state.confirmpassword}
                    />
                    <div>
                    </div>
                    <br/>
                    <input type="submit" value="Confirm" />
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                     <input
                         type="button"
                         className="edit-button"
                         onClick={this.redirect}
                         value="Edit"
                     />
                  </form>
            </div>
    </div>
    );
  }
}
