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
      tags: [],
      userreaction: 0
    };
    this.post = React.createRef();

  }

  componentDidMount() {
    this.getReputation()
  }

  //SETTING THE USER REACTION IS FAULTY, MIGHT TAKE A FEW CLICKS
  getReputation(){
    fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.props.post.id+"&name=upvote&type=reaction", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
    }).then(res => res.json()
    ).then(
        result => {
            this.setState({
              likes: result[1]
            })
        }
    )
    fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.props.post.id+"&name=downvote&type=reaction", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
    }).then(res => res.json()
    ).then(
        result => {
            this.setState({
              dislikes: result[1]
            })
        }
    )
    fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.props.post.id +"&userID="+sessionStorage.getItem("user")+"&name=upvote&type=reaction", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
    }).then(res => res.json()
    ).then(
        result => {
            var status = 0;
            if(result[1] === 1){
              status = 1;
              console.log("Check1:"+status);
            }else{
              fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.props.post.id +"&userID="+sessionStorage.getItem("user")+"&name=downvote&type=reaction", {
                method: "GET",
                headers: {
                  'Authorization': 'Bearer '+sessionStorage.getItem("token")
                }
              }).then(res => res.json()
              ).then(
                  result => {
                      if(result[1] === 1){
                        status = -1;
                        console.log("Check2:"+status);
                      }else{
                        status = 0;
                        console.log("Check3:"+status);
                      }
                  }
              )
            }
            this.setState({
              userreaction: status
            });
            console.log("Reputation given by user: " + this.state.userreaction);
        }
    )
  }


  like(event) {
    console.log("postid??"+event.target.id);
    fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.props.post.id +"&userID="+sessionStorage.getItem("user")+"&name=upvote&type=reaction", {
      method: "GET",
      headers: {
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
                    result =>{
                        console.log("Sent reaction: " + result.name)
                    }
                )
            }
        }
    )
    fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.props.post.id +"&userID="+sessionStorage.getItem("user")+"&name=downvote&type=reaction", {
      method: "GET",
      headers: {
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
    this.getReputation()
  }

  dislike(event){
    fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.props.post.id +"&userID="+sessionStorage.getItem("user")+"&name=downvote&type=reaction", {
      method: "GET",
      headers: {
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
                    result =>{
                        console.log("Sent reaction: " + result.name)
                    }
                )
            }
        }
    )
    fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.props.post.id +"&userID="+sessionStorage.getItem("user")+"&name=upvote&type=reaction", {
      method: "GET",
      headers: {
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
    this.getReputation()
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

  render() {
    return (
      <div className="post-comment-block">
        <div className="meme-side">
          <div>
            <img src={this.props.post.thumbnailURL} className="meme"/>
          </div>
          <div className="memeStuff">
            <div>
              <h1 className="meme-name">{this.props.post.content}</h1><br/>
            </div>
            <div className="postInterations">
              <div className="upButton">
                <img src={upArrow} className="arrows" onClick={event => this.like(event)}/>
              </div>
              <div className="downButton">
                <img src={downArrow} className="arrows" onClick={event => this.dislike(event)}/>
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
