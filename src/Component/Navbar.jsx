import React from "react";
import "../App.css";
import "./styles/Navbar.css"
import {
   Link
} from 'react-router-dom';
// pull in the images for the menu items
import post from "../assets/createpost.png";
import logo from "../assets/logo.png";
import postIcon from "../assets/post.svg";
import newPostIcon from "../assets/new_post.svg";
import friendIcon from "../assets/friends.svg";
import settingIcon from "../assets/settings.svg";
// import helpIcon from "../assets/help.svg";
import homeIcon from "../assets/MemeMe.svg"
import profileIcon from "../assets/profile.svg"
import toggleSignup from "./LoginForm.jsx";

/* The Navbar class provides navigation through react router links.  Note the callback
   to the parent app class in the last entry... this is an example of calling a function
   passed in via props from a parent component */
class Navbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profile_picture: "",
      logged_in: false
    };
  }

  componentDidMount() {
    this.getProfilePicture();
  }

  getProfilePicture = () => {
    if(sessionStorage.getItem("user") != null){
        fetch(process.env.REACT_APP_API_PATH+"/user-artifacts?ownerID=" + sessionStorage.getItem("user") + "&category=profile_picture", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(
                result => {
                    if(sessionStorage.getItem("user") != null){
                      if(result[0][0]["url"].charAt(0) == '/'){
                        this.setState({
                          profile_picture: "https://webdev.cse.buffalo.edu" + result[0][0]["url"],
                          logged_in: true
                        });
                      } else {
                        this.setState({
                          profile_picture: result[0][0]["url"],
                          logged_in: true
                        });
                      }
                    } else {
                    this.setState({
                        profile_picture: "",
                        logged_in: false
                    });
                    }
                }
            );
    }
  }

  reloadHandler = () => {
      console.log(window.location.href)
      if (window.location.href.includes('/random')) {
          window.location.reload();
      }
      else {
          window.location.href = "random";
      }
  }

    profileRedirect = () => {
      if (window.location.href.includes("/profile/") || window.location.href.includes("/tag/")) {
          window.location.href = "../profile/" + sessionStorage.getItem("user");
      }
      else {
          window.location.href = "profile/" + sessionStorage.getItem("user");
      }
    };

  logout = () => {
    sessionStorage.removeItem("token", null);
    sessionStorage.removeItem("user", null);
    this.state = {
      profile_picture: "",
      logged_in: false
    };
      window.location.href = "/hci/fantasticfour/login";
  }

  render() {
    if(sessionStorage.getItem("user") != null){
      if(this.state.profile_picture == ""){
        this.getProfilePicture();
      }
    return (
    <div id="sidenav" className="topNav">
      <iconbar id="logobar" className="logobar">
        <li className="home">
          <Link to="/" >
            <img src={logo} title="Latest"/>
          </Link>
        </li>
      </iconbar>
      <ul id="side-menu-items">
        <li>
          <Link to="/" style={{textDecoration: 'none', color: 'black'}}>
            Latest
          </Link>
        </li>
        <li>
          <Link to="/popular" style={{textDecoration: 'none', color: 'black'}}>
            Popular
          </Link>
        </li>
          <li className="random">
          <Link to="/random" onClick={this.reloadHandler} style={{textDecoration: 'none', color: 'black'}}>
              Random
          </Link>
            </li>
        <li>
          <Link to="/styleguide" style={{textDecoration: 'none', color: 'black'}}>
            Style Guide
          </Link>
        </li>
        <li>
          <Link to="/upload" style={{textDecoration: 'none', color: 'black'}}>
            Upload a Post
          </Link>
        </li>
      </ul>

      <loginbar id="loginbar" className="loginbar">
          <li className="signupbar">
            <Link to="/home" style={{textDecoration: 'none', color: 'black'}} onClick={this.logout}>
              Log Out
            </Link>
          </li>
          <li className="signupbar">
            <Link onClick={this.profileRedirect} title="My Profile" style={{textDecoration: 'none', color: 'black'}}>
              <img src={this.state.profile_picture} alt="profile picture" className="small-profile-picture"/>
            </Link>
          </li>
      </loginbar>
    </div>
  );
  } else {
  return (
    <div id="sidenav" className="topNav">
      <iconbar id="logobar" className="logobar">
        <li className="home">
          <Link to="/" >
            <img src={logo} title="Latest"/>
          </Link>
        </li>
      </iconbar>
      <ul id="side-menu-items">
        <li>
          <Link to="/" style={{textDecoration: 'none', color: 'black'}}>
            Latest
          </Link>
        </li>
          <li>
            <Link to="/popular" style={{textDecoration: 'none', color: 'black'}}>
              Popular
            </Link>
          </li>
          <li>
              <Link to="/random" onClick={this.reloadHandler} style={{textDecoration: 'none', color: 'black'}}>
                  Random
              </Link>
          </li>
        <li>
          <Link to="/styleguide" style={{textDecoration: 'none', color: 'black'}}>
            Style Guide
          </Link>
        </li>
      </ul>

      <loginbar id="loginbar" className="loginbar">
        <li>
          <Link to="/login" style={{textDecoration: 'none', color: 'black'}}>
            Login / Sign Up
          </Link>
        </li>
      </loginbar>
    </div>
  );
  }
  }

}
export default Navbar;
