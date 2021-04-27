import React from "react";

import "../App.css";
import "./styles/ProfileBlock.css";

export default class ProfileBlock extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          profile_picture: "",
          username: "",
          email: "",
          followers: "",
          following: ""
        };
    }

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
                  }
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
      fetch(process.env.REACT_APP_API_PATH+"/connections?userID=" + sessionStorage.getItem("user"), {
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
                      following: result[1]
                  });
              }
          );
      fetch(process.env.REACT_APP_API_PATH+"/connections?connectedUserID=" + sessionStorage.getItem("user"), {
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
                      followers: result[1]
                  });
              }
          );
  }

  toFollowers = () => {
    window.location.href = "followers";
  };

  toFollowing = () => {
    window.location.href = "following";
  };

  toProfileInfo = () => {
    window.location.href = "profileinfo";
  };

    render() {
        return(
            <div > 
                <p className="tag-header">{this.state.username}</p>
                <img src={this.state.profile_picture} alt="profile picture" className="profile-picture-block"/>
                <br/>
                <a onClick={this.toFollowers} className="text-link">
                  Followers: {this.state.followers}
                </a>
                <br/>
                  <a onClick={this.toFollowing}className="text-link">
                    Following: {this.state.following}
                  </a>
                <br/>
                <input
                  type="button"
                  className="desktop-confirm edit-button"
                  onClick={this.toProfileInfo}
                  value="Profile Settings"
                />
            </div>
        );
        
    }
}
