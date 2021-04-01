import React from "react";
import "../App.css";

//The post form component holds both a form for posting, and also the list of current posts in your feed
export default class UserProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profile_picture: "",
      username: "",
      email: "",
      followers: "",
      following: ""
    };
    this.postListing = React.createRef();
  }

    toSettings = () => {
        window.location.href = "settings";
    };

    toFollowers = () => {
        window.location.href = "followers";
    };

    toFollowing = () => {
        window.location.href = "following";
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
                  if(sessionStorage.getItem("user") != null){
                    this.setState({
                        profile_picture: result[0][0]["url"]
                    });
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

  render() {
    return (
        <div>
          <img src={this.state.profile_picture} alt="profile picture" className="user-profile-picture"/>
          <br/><br/>
            <a onClick={this.toFollowers} className="profile-followers">
                Followers: {this.state.followers}
            </a>
          <br/>
            <a onClick={this.toFollowing}className="profile-followers">
                Following: {this.state.following}
            </a>
          <br/>
          Username: {this.state.username}
          <br/>
          Email: {this.state.email}
          <br/><br/>
            <input
                type="button"
                className="edit-button"
                onClick={this.toSettings}
                value="Edit"
            />
        </div>
    );
  }
}
