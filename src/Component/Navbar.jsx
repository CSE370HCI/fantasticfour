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
                    this.setState({
                        profile_picture: result[0][0]["url"],
                        logged_in: true
                    });
                    } else {
                    this.setState({
                        profile_picture: "",
                        logged_in: false
                    });
                    }
                }
            );
  }

  logout = () => {
    sessionStorage.removeItem("token", null);
    sessionStorage.removeItem("user", null);
    this.state = {
      profile_picture: "",
      logged_in: false
    };
    window.location.reload();
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
            <img src={logo} />
          </Link>
        </li>
      </iconbar>
      <ul id="side-menu-items">
        <li className="home">
          <Link to="/" style={{textDecoration: 'none', color: 'black'}}>
            Home
          </Link>
        </li>
        <li className="latest">
          <Link to="/latest" style={{textDecoration: 'none', color: 'black'}}>
            Latest
          </Link>
        </li>
        <li className="popular">
          <Link to="/popular" style={{textDecoration: 'none', color: 'black'}}>
            Popular
          </Link>
        </li>
        <li className="random">
          <Link to="/random" style={{textDecoration: 'none', color: 'black'}}>
            Random
          </Link>
        </li>
        <li className="style guide">
          <Link to="/styleguide" style={{textDecoration: 'none', color: 'black'}}>
            Style Guide
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
            <Link to="/profile" title={sessionStorage.getItem("user")} style={{textDecoration: 'none', color: 'black'}}>
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
            <img src={logo} />
          </Link>
        </li>
      </iconbar>
      <ul id="side-menu-items">
        <li className="latest">
          <Link to="/latest" style={{textDecoration: 'none', color: 'black'}}>
            Latest
          </Link>
        </li>
          <li className="popular">
            <Link to="/popular" style={{textDecoration: 'none', color: 'black'}}>
              Popular
            </Link>
          </li>
        <li className="random">
          <Link to="/random" style={{textDecoration: 'none', color: 'black'}}>
            Random
          </Link>
        </li>
        <li className="style guide">
          <Link to="/styleguide" style={{textDecoration: 'none', color: 'black'}}>
            Style Guide
          </Link>
        </li>
      </ul>

      <loginbar id="loginbar" className="loginbar">
        <li className="login">
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
