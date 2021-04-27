import React from "react";
import "../App.css";
import "./styles/Upload.css";

//The post form component holds both a form for posting, and also the list of current posts in your feed
export default class Upload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post_title: "",
      post_message: "",
      post_URL: "",
      tag: "",
      canIPost: false,
      restrictedTo: []
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
          type: "post",
          thumbnailURL: this.state.post_URL
        })
      })
          .then(res => res.json())
          .then(
              result => {
                this.setState({
                  post_message: result.Status
                });
                this.addTag(this.state.tag, result["id"])

                if (this.state.restrictedTo.length > 0) {
                  this.addAllowingTag(result["id"]);
                }
                else {
                  // redirects users back to the posts screen
                  window.location.href = "homepage";
                }
                
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

  addAllowingTag(postID) {
    let allowedUsers = this.state.restrictedTo
    for (let i = 0; i < allowedUsers.length; i++) {
      // add privacy tag
      fetch(process.env.REACT_APP_API_PATH+"/post-tags", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
        },
        body: JSON.stringify({
            postID: postID,
            userID: sessionStorage.getItem("user"),
            name: "specific",
            type: "privacy"
        })
      })
      .then(res => res.json())
      .then(result => {
        console.log("add privacy tag for post: ", postID)
      })

      // add allowing tag
      fetch(process.env.REACT_APP_API_PATH+"/post-tags", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
        },
        body: JSON.stringify({
            postID: postID,
            userID: sessionStorage.getItem("user"),
            name: allowedUsers[i],
            type: "allowing"
        })
      })
      .then(res => res.json())
      .then(result => {
        console.log("add allowing tag for user: ", allowedUsers[i])
        window.location.href = "homepage";
      })
    }
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

  updateRestrictedTo = event => {
    this.setState({
      restrictedTo: event.target.value.replace(/\s+/g, '').split(',') // parses the provided input and creates an array by splitting up names at commas
    })
  }



  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
            <br/>
            Title*
            <br/>
            <input type="text" cols="70" className="upload-input" onChange={this.updateTitle} />
            <br/>
            <br/>
            Upload Photo (URL)*
            <br/>
            <input type="text" rows="1" cols="70" className="upload-input" onChange={this.updateURL} />
            <br/>
            <br/>
            Communities
            <br/>
            <input type="text" cols="70" className="upload-input" onChange={this.updateTag} />
            <br/>
            <br/>
            Limit View
            <br/>
            <input type="text" className="upload-input" onChange={this.updateRestrictedTo} placeholder="Usernames to only allow"/>
          <br/>
          <br/>
          <input className="submit-button" type="submit" value="submit" />
          <br/>
          {this.state.post_message}
        </form>
      </div>
    );
  }
}
