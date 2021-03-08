import React from "react";
import "../App.css";

//The post form component holds both a form for posting, and also the list of current posts in your feed
export default class PostForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post_title: "",
      post_message: "",
      post_URL: ""
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
        },
        error => {
          alert("error!");
        }
      );
  };

  // this method will keep the current post up to date as you type it,
  // so that the submit handler can read the information from the state.
  updateTitle = event => {
    this.setState({
      post_title: event.target.value
    });
  };

  updateURL = event => {
    this.setState({
      post_URL: event.target.value
    });
  };



  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <label>
            Title<br/>
            <textarea rows="1" cols="70" onChange={this.updateTitle} />
            <br />
            Upload Photo (URL) <br/>
            <textarea rows="10" cols="70" onChange={this.updateURL} />
          </label>
          <br />

          <input type="submit" value="submit" />
          <br />
          {this.state.post_message}
        </form>
      </div>
    );
  }
}
