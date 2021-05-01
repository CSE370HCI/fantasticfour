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
          following: "",
          user_id: this.props.id
        };
    }

componentDidMount() {
      fetch(process.env.REACT_APP_API_PATH+"/user-artifacts?ownerID=" + this.state.user_id + "&category=profile_picture", {
          method: "GET",
          headers: {
              'Content-Type': 'application/json'
          }
      })
          .then(res => res.json())
          .then(
              result => {
                  if(result[0][0] != null){
                    if(result[0][0]["url"].charAt(0) == '/'){
                      this.setState({
                        profile_picture: "https://webdev.cse.buffalo.edu" + result[0][0]["url"]
                      });
                    } else {
                      this.setState({
                        profile_picture: result[0][0]["url"]
                      });
                    }
                  } else {
                    this.setState({
                      profile_picture: "https://i.imgur.com/UJ9uaCg.png"
                    });
                  }
              }
          );
      fetch(process.env.REACT_APP_API_PATH+"/users/" + this.state.user_id, {
          method: "GET",
          headers: {
              'Content-Type': 'application/json',
          }
      })
          .then(res => res.json())
          .then(
              result => {
                  this.setState({
                      username: result["username"]
                  });
              }
          );
      fetch(process.env.REACT_APP_API_PATH+"/connections?userID=" + this.state.user_id, {
          method: "GET",
          headers: {
              'Content-Type': 'application/json'
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
      fetch(process.env.REACT_APP_API_PATH+"/connections?connectedUserID=" + this.state.user_id, {
          method: "GET",
          headers: {
              'Content-Type': 'application/json'
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
    window.location.href = "../followers";
  };

  toFollowing = () => {
    window.location.href = "../following";
  };

  toProfileInfo = () => {
    window.location.href = "../profileinfo";
  };

    render() {
      if(this.state.user_id == sessionStorage.getItem("user")) {
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
        } else {
        return(
          <div >
            <p className="tag-header">{this.state.username}</p>
            <img src={this.state.profile_picture} alt="profile picture" className="profile-picture-block"/>
            <br/>
            <content>
              Followers: {this.state.followers}
            </content>
            <br/>
            <content>
              Following: {this.state.following}
            </content>
            <br/>
            <br/>
            <br/>
          </div>
          );
        }
    }
}
