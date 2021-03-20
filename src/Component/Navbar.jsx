import React from "react";
import "../App.css";
import {
   Link
} from 'react-router-dom';
// pull in the images for the menu items
import post from "../assets/createpost.png";
import logo from "../assets/logo.png";
import postIcon from "../assets/post.svg";
import friendIcon from "../assets/friends.svg";
import settingIcon from "../assets/settings.svg";
import helpIcon from "../assets/help.svg";

/* The Navbar class provides navigation through react router links.  Note the callback
   to the parent app class in the last entry... this is an example of calling a function
   passed in via props from a parent component */
class Navbar extends React.Component {

  render() {
    return (
    <div id="sidenav" className="topNav">
      <iconbar id="logobar" className="logobar">
        <li className="home">
          <Link to="/home" >
            <img
              src={logo}
            />
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
          <Link to="/settings" style={{textDecoration: 'none', color: 'black'}}>
            Login
          </Link>
        </li>
        <li className="sign up">
          <Link to="/settings" style={{textDecoration: 'none', color: 'black'}}>
            Sign Up
          </Link>
        </li>
      </loginbar>
    </div>
  );
  }

}
export default Navbar;
