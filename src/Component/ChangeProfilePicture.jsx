import React from "react";
import "../App.css";

export default class ChangeProfilePicture extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      picture_URL: "",
      can_upload: false
    };
  }

  submitHandler = event => {

    //keep the form from actually submitting via HTML - we want to handle it in react
    event.preventDefault();
    if (this.state.picture_URL.length == 0) {
      alert("You need to include an image URL to continue")
    }
    else if (!this.state.picture_URL.match("(?:([^:/?#]+):)?(?://([^/?#]*))?([^?#]*\\.(?:jpg|gif|png))(?:\\?([^#]*))?(?:#(.*))?")){
      alert("You must use a proper image URL")
    }
    else {
      this.state.can_upload = true;
    }
    if (this.state.can_upload) {
      //make the api call to update picture
      fetch(process.env.REACT_APP_API_PATH+"/user-artifacts?ownerID=" + sessionStorage.getItem("user") + "&category=profile_picture", {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
        },
        body: JSON.stringify({
          ownerID: sessionStorage.getItem("user"),
          type: "image",
          //Changes profile picture
          url: this.state.picture_URL,
          category: "profile_picture"
        })
      })
          .then(res => res.json())
          .then(
              result => {
                // redirects users back to the profile screen
                console.log(result);
                window.location.href = "profile";
              }
          );
    }
  };

  // this method will keep the current URL up to date as you type it,
  // so that the submit handler can read the information from the state.

  updateURL = event => {
    this.setState({
      picture_URL: event.target.value
    });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <label>
            <img src={this.state.picture_URL} alt="Upload Photo" className="user-profile-picture"/>
            <br/>
            <input type="text" rows="1" cols="70" className="upload-input" onChange={this.updateURL} />
          </label>
          <br/>
          <br/>
          <input className="submit-button" type="submit" value="Save" />
        </form>
      </div>
    );
  }
}