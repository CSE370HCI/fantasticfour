import React from "react";
import "../App.css";

//The post form component holds both a form for posting, and also the list of current posts in your feed
export default class PostForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post_title: "",
      post_message: "",
      post_URL: "",
      tag: "",
      canIPost: false
    };
    this.postListing = React.createRef();
  }

  // the handler for submitting a new post.  This will call the API to create a new post.
  // while the test harness does not use images, if you had an image URL you would pass it
  // in the thumbnailURL field.
  submitHandler = event => {

    //keep the form from actually submitting via HTML - we want to handle it in react
    event.preventDefault();
    if (this.state.post_title.length == 0) {
      alert("You need a post title to continue")
    }
    else if (this.state.post_URL.length == 0) {
      alert("You need to include an image URL to continue")
    }
    else if (!this.state.post_URL.match("(?:([^:/?#]+):)?(?://([^/?#]*))?([^?#]*\\.(?:jpg|gif|png))(?:\\?([^#]*))?(?:#(.*))?")){
      alert("You must use a proper image URL")
    }
    else {
      this.state.canIPost = true;
    }
    if (this.state.canIPost) {
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
                this.addTag(this.state.tag, result["id"])
                // redirects users back to the posts screen
                window.location.replace("/posts");
              }
          );
    }
  };

  addTags(list, post){
    for(var i=0;i<list.length;i++){
      var tag = list[0];
      if(tag.charAt(0) === '#'){
        tag = tag.substring(1);
      }
      this.addTag(tag, post);
    }
  }

  addTag(tag, post){
    fetch(process.env.REACT_APP_API_PATH+"/post-tags", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },
      body: JSON.stringify({
          postID: post,
          userID: null,
          name: tag,
          type: "hashtag"
      })
    }).then(
        res => res.json()
    ).then(
        result =>{
            console.log("Received: " + result.name)
        }
    )
  }

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

  updateTag = event => {
    this.setState({
      tag: event.target.value
    });
  };



  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <label>
            <br/>
              Title*<br/>
            <input type="text" cols="70" className="upload-input" onChange={this.updateTitle} />
            <br /><br />
            Upload Photo (URL)* <br/>
            <input type="text" rows="1" cols="70" className="upload-input" onChange={this.updateURL} />
            <br /><br />
            Communities <br/>
            <input type="text" cols="70" className="upload-input" onChange={this.updateTag} />
          </label>
          <br />
          <br />

          <input type="submit" value="submit" />
          <br />
          {this.state.post_message}
        </form>
      </div>
    );
  }
}
