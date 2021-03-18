import React from "react";
import "../App.css";
import CommentForm from "./CommentForm.jsx";
import helpIcon from "../assets/delete.png";
import commentIcon from "../assets/comment.svg";
import upArrow from "../assets/UpArrow.svg";
import downArrow from "../assets/DownArrow.svg";

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      comments: this.props.post.commentCount,
      likes: 1,
      dislikes: 0,
      tags: []
    };
    this.post = React.createRef();

  }

  setLikesCount(newcount){
    this.setState({
      likes: this.state.likes + newcount
    });
  };

  getLikesCount() {
    if (!this.state.likes || this.state.likes === "0") {
      return 0;
    }
    return parseInt(this.state.likes);
  }

  setDisikesCount(newcount) {
    this.setState({
      dslikes: this.state.dislikes + newcount
    });
  };

  addTag(tag){
    fetch(process.env.REACT_APP_API_PATH+"/post-tags/", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        postID: this.props.post.id,
        userID: sessionStorage.getItem("user"),
        name: tag,
        type: "hashtag"
      })
    }).then(res => res.json())
    .then(
      result => {
        this.setState({
          responseMessage: result.Status
        });
      },
      error => {
        alert("error!");
      }
    );
  }

  getTags(){
    return this.state.tags
  }

  getDisikesCount() {
    if (!this.state.dislikes || this.state.dislikes === "0") {
      return 0;
    }
    return parseInt(this.state.dislikes);
  }

  showModal = e => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  setCommentCount = newcount => {
    this.setState({
      comments: newcount
    });
  };

  getCommentCount() {
    if (!this.state.comments || this.state.comments === "0") {
      return 0;
    }
    return parseInt(this.state.comments);
  }

  showHideComments() {
    if (this.state.showModal) {
      return "comments show";
    }
    return "comments hide";
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
          this.props.loadPosts();
        },
        error => {
          alert("error!"+error);
        }
      );
  }


  // we only want to display comment information if this is a post that accepts comments
  conditionalDisplay() {
    console.log("Comment count is " + this.props.post.commentCount);

    //if (this.props.post.commentCount <= 0) {
    //  return "";
    //  }

    //else {
      return (
        <div className="comment-block">
          <div className="comment-indicator">
            <div className="comment-indicator-text">
              {this.getCommentCount()} Comments
            </div>
            <img
              src={commentIcon}
              className="comment-icon"
              onClick={e => this.showModal()}
              alt="View Comments"
            />
          </div>
          <div className={this.showHideComments()}>
            <CommentForm
              onAddComment={this.setCommentCount}
              parent={this.props.post.id}
              commentCount={this.getCommentCount()}
            />
          </div>
        </div>
      );
    //}

  }

  // we only want to expose the delete post functionality if the user is
  // author of the post
  showDelete(){
    if (this.props.post.author.id === sessionStorage.getItem("user")) {
      return(
      <img
        src={helpIcon}
        className="sidenav-icon deleteIcon"
        alt="Delete Post"
        title="Delete Post"
        onClick={e => this.deletePost(this.props.post.id)}
      />
    );
    }
    return "";
  }

  render() {
    console.log("Post.jsx div: "+ [this.props.type,"postbody"].join(" "));
    return (
      <div className="post-comment-block">
        <div className="meme-side">
          <div>
            <img src={this.props.post.thumbnailURL} className="meme"/>
          </div>

          <div className="memeStuff">
            <div className="upButton">
              <img src={upArrow} className="arrows"/>
            </div>
            <div className="downButton">
              <img src={downArrow} className="arrows"/>
            </div>
            <div className="name-block">
              <h1 className="meme-name">{this.props.post.content}</h1>
            </div>
            <div className="poster-block">
              <h1 className="meme-poster">{this.props.post.author.username}</h1>
            </div>
          </div>
        </div>

        <div  className="comment-side">
          <div className="">
            ({this.props.post.createdAt})
            {this.showDelete()}
          </div>
          {this.conditionalDisplay()}
        </div>
      </div>
    );
  }
}
