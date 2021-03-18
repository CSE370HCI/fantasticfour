import React from "react";
import "../App.css";

//The post form component holds both a form for posting, and also the list of current posts in your feed
export default class PostForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profile_picture: "",
      username: "",
      email: ""
    };
    this.postListing = React.createRef();
  }

  // the handler for submitting a new post.  This will call the API to create a new post.
  // while the test harness does not use images, if you had an image URL you would pass it
  // in the thumbnailURL field.
  submitHandler = event => {

    //keep the form from actually submitting via HTML - we want to handle it in react
    event.preventDefault();

    //make the api call to post
    fetch(process.env.REACT_APP_API_PATH+"/posts", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        authorID: sessionStorage.getItem("user"),
        content: this.state.post_title,
        thumbnailURL: this.state.post_URL,
        type: "post"
      })
    })
        .then(res => res.json())
        .then(
            result => {
              this.setState({
                post_message: result.Status
              });

              // redirects users back to the posts screen
              window.location.replace("/posts");
            }
        );
  };
    redirect = () => {
        window.location.replace("/");
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
        </div>
    );
  }
}
