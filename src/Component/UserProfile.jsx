import React from "react";
import {Link} from 'react-router-dom';
import "../App.css";

//The post form component holds both a form for posting, and also the list of current posts in your feed
export default class UserProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profile_picture: "",
      username: "",
      email: ""
    };
    this.postListing = React.createRef();
  }

    redirect = () => {
        window.location.href = "settings";
    };

  componentDidMount() {
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
                  this.setState({
                      profile_picture: result[0][0]["url"]
                  });
              }
          );
      fetch(process.env.REACT_APP_API_PATH+"/users/" + sessionStorage.getItem("user"), {
          method: "GET",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+sessionStorage.getItem("token")
          }
      })
          .then(res => res.json())
          .then(
              result => {
                  this.setState({
                      username: result["username"],
                      email: result["email"]
                  });
              }
          );
  }

  render() {
    return (
        <div>
          <img src={this.state.profile_picture} alt="profile picture" className="user-profile-picture"/>
          <br/><br/>
          Username: {this.state.username}
          <br/>
          Email: {this.state.email}
          <br/><br/>
            <input
                type="button"
                className="edit-button"
                onClick={this.redirect}
                value="Edit"
            />
            <br/>
            <Link to="/logout">
                <input type="button" className="danger-button-unblocked" value="Logout"/>
            </Link>
        </div>
    );
  }
}
