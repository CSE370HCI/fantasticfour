import React from "react";
import "../App.css";
import {
   Link
} from 'react-router-dom';
// pull in the images for the menu items
import postIcon from "../assets/post.svg";
import newPostIcon from "../assets/new_post.svg";
import friendIcon from "../assets/friends.svg";
import settingIcon from "../assets/settings.svg";
// import helpIcon from "../assets/help.svg";
import homeIcon from "../assets/MemeMe.svg"
import profileIcon from "../assets/profile.svg"

/* The Navbar class provides navigation through react router links.  Note the callback
   to the parent app class in the last entry... this is an example of calling a function
   passed in via props from a parent component */
class Navbar extends React.Component {

  render() {
    return (
    <div id="topnav" className="topnav">
      <ul id="topnav ul">
      <li className="topnav-button">
          <Link to="/">
          <img
              src={homeIcon}
              className="topnav-home-button"
              alt="Home"
              title="Home"
            />
          </Link>
        </li>
        <li className="topnav-button">
          <Link to="/posts">
            <img
              src={postIcon}
              className="sidenav-icon"
              alt="Posts"
              title="Posts"
            />
          </Link>
        </li>
        <li className="topnav-button">
          <Link to="/friends">
            <img
              src={friendIcon}
              className="sidenav-icon"
              alt="Friends"
              title="Friends"
            />
          </Link>
        </li>
        <li className="topnav-button-right">
          <Link to="/settings">
            <img
              src={settingIcon}
              className="sidenav-icon"
              alt="Settings"
              title="Settings"
            />
          </Link>
        </li>
        <li className="topnav-button">
          <Link to="/upload">
            <img
              src={newPostIcon}
              className="sidenav-icon"
              alt="Create a Post"
              title="Create a Post"
            />
          </Link>
        </li>
        <li className="topnav-button">
          <Link to="/profile">
            <img
                src={profileIcon}
                className="sidenav-icon"
                alt="My Profile"
                title="My Profile"
            />
          </Link>
        </li>

      </ul>
    </div>
  );
  }

}
export default Navbar;
