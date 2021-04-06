import React from "react";
import "../App.css";
import "./styles/Post.css"
import CommentForm from "./CommentForm.jsx";
import helpIcon from "../assets/delete.png";
import commentIcon from "../assets/comment.svg";
import upArrow from "../assets/UpArrow.svg";
import downArrow from "../assets/DownArrow.svg";
import { parseConfigFileTextToJson } from "typescript";

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      comments: this.props.post.commentCount,
      likes: 1,
      dislikes: 0,
      tags: [],
      userreaction: 0
    };
    this.post = React.createRef();

  }

  componentDidMount() {
    this.getUserReaction()
  }

  getUserReaction(){
  if(sessionStorage.getItem("user") != null){
    console.log("Check1")
    fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.props.post.id +"&userID="+sessionStorage.getItem("user")+"&type=reaction", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
    }).then(result => result.json()
    ).then(
        result => {
          console.log(result)
          if(result[1] === 0){
            console.log("Found reactions: ", result[1])
            this.setState({
              userreaction: 0
            })
          }else if(result[0][0].name === "upvote"){
            this.setState({
              userreaction: 1
            })
          }else {
            console.log("Else: ", result[0][0].name)
            this.setState({
              userreaction: -1
            })
          }
        }
    )
    }
  }

  like(event) {
  if(sessionStorage.getItem("user") != null){
    console.log("postid??"+this.props.post.id);
    fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.props.post.id +"&userID="+sessionStorage.getItem("user")+"&name=upvote&type=reaction", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
    }).then(res => res.json()
    ).then(
      result => {
        if(result[1] === 0){
          fetch(process.env.REACT_APP_API_PATH+"/post-tags", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
              },
              body: JSON.stringify({
                  postID: this.props.post.id,
                  userID: sessionStorage.getItem("user"),
                  name: "upvote",
                  type: "reaction"
              })
            }).then(
                res => res.json()
            ).then(
              fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.props.post.id +"&userID="+sessionStorage.getItem("user")+"&name=downvote&type=reaction", {
                method: "GET",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer '+sessionStorage.getItem("token")
                }
              }).then(res => res.json()
              ).then(
                  result => {
                      if(result[1] === 1){
                        fetch(process.env.REACT_APP_API_PATH+"/post-tags/"+result[0][0].id, {
                            method: "DELETE",
                            headers: {
                              'Authorization': 'Bearer '+sessionStorage.getItem("token")
                            }
                          })
                      }
                  }
              )
            ).then(
              this.setState({
                userreaction: 1
              })
            )
        }else{
          fetch(process.env.REACT_APP_API_PATH+"/post-tags/"+result[0][0].id, {
            method: "DELETE",
            headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
          }).then(
            this.setState({
              userreaction: 0
            })
          )
        }
      }
    )
    //THIS PRINT CONSOLE LINE DOESN'T GIVE CORRECT USERREACTION
    //console.log("Reputation given by user on post ", this.props.post.id, " is: ", this.state.userreaction)
  }
  }

  dislike(event){
  if(sessionStorage.getItem("user") != null){
    console.log("postid??"+this.props.post.id);
    fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.props.post.id +"&userID="+sessionStorage.getItem("user")+"&name=downvote&type=reaction", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
    }).then(res => res.json()
    ).then(
      result => {
        if(result[1] === 0){
          fetch(process.env.REACT_APP_API_PATH+"/post-tags", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
              },
              body: JSON.stringify({
                  postID: this.props.post.id,
                  userID: sessionStorage.getItem("user"),
                  name: "downvote",
                  type: "reaction"
              })
          }).then(
              res => res.json()
          ).then(
            fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.props.post.id +"&userID="+sessionStorage.getItem("user")+"&name=upvote&type=reaction", {
              method: "GET",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
              }
            }).then(res => res.json()
            ).then(
              result => {
                if(result[1] === 1){
                  fetch(process.env.REACT_APP_API_PATH+"/post-tags/"+result[0][0].id, {
                      method: "DELETE",
                      headers: {
                        'Authorization': 'Bearer '+sessionStorage.getItem("token")
                      }
                    })
                }
              }
            )
          ).then(
            this.setState({
              userreaction: -1
            })
          )
        }else{
          fetch(process.env.REACT_APP_API_PATH+"/post-tags/"+result[0][0].id, {
            method: "DELETE",
            headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
          }).then(
            this.setState({
              userreaction: 0
            })
          )
        }
      }
    )
    //THIS PRINT CONSOLE LINE DOESN'T GIVE CORRECT USERREACTION
    //console.log("Reputation given by user on post ", this.props.post.id, " is: ", this.state.userreaction)
  }
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
  if(sessionStorage.getItem("user") != null){
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
  }


  // we only want to display comment information if this is a post that accepts comments
  conditionalDisplay() {
    //if (this.props.post.commentCount <= 0) {
    //  return "";
    //  }
    if(sessionStorage.getItem("user") != null){
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
  }

  // we only want to expose the delete post functionality if the user is
  // author of the post
  showDelete(){
    if (this.props.post.author.id == sessionStorage.getItem("user")) {
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

  isUp(){
  if(sessionStorage.getItem("user") != null){
    if(this.state.userreaction === 1){
      return "upButtonLit"
    }else if(this.state.userreaction === 0){
      return "upButton"
    }else{
      return "greyButton"
    }
    }
  }

  isDown(){
  if(sessionStorage.getItem("user") != null){
    if(this.state.userreaction === -1){
      return "downButtonLit"
    }else if(this.state.userreaction === 0){
      return "downButton"
    }else{
      return "greyButton"
    }
    }
  }

  render() {
    return (
      <div className="post-comment-block">
        <div className="meme-side">
          <div>
            <img src={this.props.post.thumbnailURL} className="meme" alt=""/>
          </div>
          <div className="memeStuff">
            <div>
              <h1 className="meme-name">{this.props.post.content}</h1><br/>
            </div>
            <div className="postInterations">
              <div className={this.isUp()}>
                {this.state.userreaction}
                <img src={upArrow} className={(this.state.userreaction === 1) ? 'arrowsLit' : 'arrows'} onClick={event => this.like(event)} alt={this.state.userreaction}/>
              </div>
              <div className={this.isDown(0)}>
                <img src={downArrow} className={(this.state.userreaction === -1) ? 'arrowsLit' : 'arrows'} onClick={event => this.dislike(event)} alt={this.state.userreaction}/>
              </div>
              <div className="poster-block">
                <h1 className="meme-poster">{this.props.post.author.username}</h1>
              </div>
            </div>
          </div>
        </div>

        <div  className="comment-side">
          <div className="">
            {this.showDelete()}
          </div>
          {this.conditionalDisplay()}
        </div>
      </div>
    );
  }
  //note: time removed from render because time is irrelevant, memes are timeless
}
