import React from "react";
import "../App.css";

//The post form component holds both a form for posting, and also the list of current posts in your feed
export default class PostForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      delete_text: "",
      post_message:"",
      button_state_css: "danger-button-blocked",
      button_disabled: true
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
    fetch(process.env.REACT_APP_API_PATH+"/users/" + sessionStorage.getItem("user"), {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },
      // body: JSON.stringify({
      //   email: sessionStorage.getItem("email"),
      // })
    })
      .then(res => res.json())
      .then(
        error => {
          alert("error!");
        }
      );
    window.location.replace("/");
  };

  redirect = () => {
    window.location.replace("/");
  }

  // this method will keep the current post up to date as you type it,
  // so that the submit handler can read the information from the state.
  updateInput = event => {
    this.setState({
      delete_text: event.target.value
    });
    if (event.target.value != "delete") {
      this.setState({
        button_disabled: true,
        button_state_css: "danger-button-blocked"
      });
    }
    else {
      this.setState({
        button_disabled: false,
        button_state_css: "danger-button-unblocked"
      });
    }
  };



  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <label>
            <br/>
            Deleting your account will permanently remove your profile and posts that may be associated with you.
            Once your account is deleted, you will be logged out and will not be able to log back in.
            <br/><br/><br/>
            Type "delete" to confirm this action<br/>
            <input type="text" className="upload-input" onChange={this.updateInput} />
          </label>
          <br />
          <br />

          <input type="button" className= "cancel-button" onClick={this.redirect} value="Cancel" />
          <input type="submit" disabled = {this.state.button_disabled} className={this.state.button_state_css} value="Confirm" />
          <br />
        </form>
      </div>
    );
  }
}
