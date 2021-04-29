import React from "react";
import "../App.css";
import "./styles/UserProfile.css";

//The post form component holds both a form for posting, and also the list of current posts in your feed
export default class UserProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profile_picture: "",
      username: "",
      email: "",
      followers: "",
      following: "",
        reputation_count: 0
    };
    this.postListing = React.createRef();
  }

    toSettings = () => {
        window.location.href = "settings";
    };

    toChangePicture = () => {
        window.location.href = "changepicture";
    };

    toFollowers = () => {
        window.location.href = "followers";
    };

    toFollowing = () => {
        window.location.href = "following";
    };

    toBlockList = () => {
        window.location.href = "blocklist";
    }

    getUserReputation() {
        fetch(process.env.REACT_APP_API_PATH+"/posts?sort=newest&authorID=" + sessionStorage.getItem("user"), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(
                result => {
                    for(const post of result[0]) {
                        fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID=" + post['id'] + '&name=upvote&type=reaction', {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })
                            .then(res => res.json())
                            .then(
                                result => {
                                    this.setState({
                                        reputation_count: this.state.reputation_count + result[1]
                                    })
                                }
                            )
                        fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID=" + post['id'] + '&name=downvote&type=reaction', {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })
                            .then(res => res.json())
                            .then(
                                result => {
                                    this.setState({
                                        reputation_count: this.state.reputation_count - result[1]
                                    })
                                }
                            )
                    }
                }
            )
    }

  componentDidMount() {
        this.getUserReputation()
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

  render() {
    return (
        <div>
          <img src={this.state.profile_picture} alt="profile picture" className="user-profile-picture"/>
          <br/>
          <a onClick={this.toChangePicture} className="text-link">
                Change Profile Picture
          </a>
          <br/>
            <br/>
            <a onClick={this.toFollowers} className="text-link">
                Followers: {this.state.followers}
            </a>
          <br/>
            <a onClick={this.toFollowing}className="text-link">
                Following: {this.state.following}
            </a>
            <br/>
            <a onClick={this.toBlockList}className="text-link">
                Blocking: {this.state.blocking}
            </a>
            <br/>
            <br/>
            <a >
                Reputation: {this.state.reputation_count}
            </a>
            <br/>
          Username: {this.state.username}
          <br/>
          Email: {this.state.email}
          <br/><br/>
            <input
                type="button"
                className="desktop-confirm edit-button"
                onClick={this.toSettings}
                value="Edit"
            />
        </div>
    );
  }
}
