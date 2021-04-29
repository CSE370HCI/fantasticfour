import React from "react";
import "../App.css";
import "./styles/Upload.css";
import deleteIcon from "../assets/delete.png";

//The post form component holds both a form for posting, and also the list of current posts in your feed
export default class EditForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post_title: this.props.post.content,
      post_message: "",
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
    else {
      this.state.canIPost = true;
    }
    if (this.state.canIPost) {
      //make the api call to post
      fetch(process.env.REACT_APP_API_PATH+"/posts/"+this.props.post.id, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
        },
        body: JSON.stringify({
          content: this.state.post_title
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
                window.location.href = "homepage";
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

  updateTag = event => {
    this.setState({
      tag: event.target.value
    });
  };

  showDelete(){
      return(
      <img
        src={deleteIcon}
        className="sidenav-icon deleteIcon"
        alt="Delete Post"
        title="Delete Post"
        onClick={e => this.deletePost(this.props.postid)}
      />
    );
  }

  deletePost(postID) {
      //make the api call to post
      fetch(process.env.REACT_APP_API_PATH+"/posts/"+postID, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
        }
        })
        .then(
          result => {
            
          },
          error => {
            alert("error!"+error);
          }
        );
    }

  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <img
          src={deleteIcon}
          className="sidenav-icon deleteIcon"
          alt="Delete Post"
          title="Delete Post"
          onClick={e => this.deletePost(this.props.postid)}
        />
            <br/>
            <heading className="edit-title">
            Title
            </heading>
            <br/>
            <input type="text" cols="70" className="upload-input" value={this.state.post_title}onChange={this.updateTitle} />
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
