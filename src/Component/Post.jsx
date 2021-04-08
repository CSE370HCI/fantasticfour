import React from "react";
import "../App.css";
import "./styles/Post.css"
import CommentForm from "./CommentForm.jsx";
import helpIcon from "../assets/delete.png";
import commentIcon from "../assets/comment.svg";
import upArrow from "../assets/UpArrow.svg";
import downArrow from "../assets/DownArrow.svg";
import { parseConfigFileTextToJson, resolveModuleName } from "typescript";


export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      commentCount: this.props.post.commentCount,
      likes: 1,
      dislikes: 0,
      tags: [],
      userreaction: 0,
      comments: [0, []], 
      tempVal: 0
    };
    this.post = React.createRef();

  }

  componentDidMount() {
    this.getUserReaction()
    this.getComments(this.props.post.id)
  }

  getUserReaction(){
  if(sessionStorage.getItem("user") != null){
    fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.props.post.id +"&userID="+sessionStorage.getItem("user")+"&type=reaction", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
    }).then(result => result.json()
    ).then(
        result => {
          if(result[1] === 0){
            this.setState({
              userreaction: 0
            })
          }else if(result[0][0].name === "upvote"){
            this.setState({
              userreaction: 1
            })
          }else {
            this.setState({
              userreaction: -1
            })
          }
        }
    )
    }
  }

  getCommentReaction(postID){
    if(sessionStorage.getItem("user") != null){
      fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+postID +"&userID="+sessionStorage.getItem("user")+"&type=reaction", {
        method: "GET",
        headers: {
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
        }
      }).then(res => res.json()
      ).then(
          result => {
            if(result[1] === 0){
              console.log("Value 0 for post "+postID)
              return 0;
            }else if(result[0][0].name === "upvote"){
              console.log("Value 1 for post "+postID)
              return 1;
            }else {
              console.log("Value -1 for post "+postID)
              return -1;
            }
          },
          error => {
            console.log("Bad request received.")
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
          if(result[1] > 1){
            for(var x=0;x<result[1];x++){
              fetch(process.env.REACT_APP_API_PATH+"/post-tags/"+result[0][x].id, {
                method: "DELETE",
                headers: {
                  'Authorization': 'Bearer '+sessionStorage.getItem("token")
                }
              })
            }
          }
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
          if(result[1] > 1){
            for(var x=0;x<result[1];x++){
              fetch(process.env.REACT_APP_API_PATH+"/post-tags/"+result[0][x].id, {
                method: "DELETE",
                headers: {
                  'Authorization': 'Bearer '+sessionStorage.getItem("token")
                }
              })
            }
          }
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
      commentCount: newcount
    });
  };

  getCommentCount() {
    if (!this.state.commentCount || this.state.commentCount === "0") {
      return 0;
    }
    return parseInt(this.state.commentCount);
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

  likeComment(postID) {
    console.log("Tried to like comment "+postID)
    fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+postID +"&userID="+sessionStorage.getItem("user")+"&name=upvote&type=reaction", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
    }).then(res => res.json()
    ).then(
      result => {
        console.log("LIKES: "+postID)
        if(result[1] === 0){
          fetch(process.env.REACT_APP_API_PATH+"/post-tags", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
              },
              body: JSON.stringify({
                  postID: postID,
                  userID: sessionStorage.getItem("user"),
                  name: "upvote",
                  type: "reaction"
              })
            }).then(
                res => res.json()
            ).then(
              fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+postID +"&userID="+sessionStorage.getItem("user")+"&name=downvote&type=reaction", {
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
            )
        }else{
          if(result[1] > 1){
            for(var x=0;x<result[1];x++){
              fetch(process.env.REACT_APP_API_PATH+"/post-tags/"+result[0][x].id, {
                method: "DELETE",
                headers: {
                  'Authorization': 'Bearer '+sessionStorage.getItem("token")
                }
              })
            }
          }
          fetch(process.env.REACT_APP_API_PATH+"/post-tags/"+result[0][0].id, {
            method: "DELETE",
            headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
          })
        }
      }
    )
    //THIS PRINT CONSOLE LINE DOESN'T GIVE CORRECT USERREACTION
    //console.log("Reputation given by user on post ", this.props.post.id, " is: ", this.state.userreaction)
  }

  dislikeComment(postID){
    console.log("Tried to dislike comment "+postID)
    fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+postID +"&userID="+sessionStorage.getItem("user")+"&name=downvote&type=reaction", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
    }).then(res => res.json()
    ).then(
      result => {
        console.log("DISLIKES: "+postID)
        if(result[1] === 0){
          fetch(process.env.REACT_APP_API_PATH+"/post-tags", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
              },
              body: JSON.stringify({
                  postID: postID,
                  userID: sessionStorage.getItem("user"),
                  name: "downvote",
                  type: "reaction"
              })
          }).then(
              res => res.json()
          ).then(
            fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+postID +"&userID="+sessionStorage.getItem("user")+"&name=upvote&type=reaction", {
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
          )
        }else{
          if(result[1] > 1){
            for(var x=0;x<result[1];x++){
              fetch(process.env.REACT_APP_API_PATH+"/post-tags/"+result[0][x].id, {
                method: "DELETE",
                headers: {
                  'Authorization': 'Bearer '+sessionStorage.getItem("token")
                }
              })
            }
          }
          fetch(process.env.REACT_APP_API_PATH+"/post-tags/"+result[0][0].id, {
            method: "DELETE",
            headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
          })
        }
      }
    )
    //THIS PRINT CONSOLE LINE DOESN'T GIVE CORRECT USERREACTION
    //console.log("Reputation given by user on post ", this.props.post.id, " is: ", this.state.userreaction)
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

  commentUp(rep){
    if(rep === 1){
      return "upButtonLitC"
    }else if(rep === 0){
      return "upButtonC"
    }else{
      return "greyButtonC"
    }
  }

  commentDown(rep){
    if(rep === -1){
      return "downButtonLitC"
    }else if(rep === 0){
      return "downButtonC"
    }else{
      return "greyButtonC"
    }
  }


  getComments(parentID) {
    console.log("postid"+this.props.post.id)
    fetch(process.env.REACT_APP_API_PATH+"/posts?sort=newest&parentID="+parentID, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },
    }).then(res => res.json()
    ).then(
        result => {
          if (result[1] === 0){
            return [0, []]
          }else{
            var cList = []
            for(var x=0;x<result[1];x++){
              var rep = this.getCommentReaction(result[0][x].id)
              console.log("After call on post "+parentID+"- rep="+rep)
              cList.push({comment: result[0][x].content, author: result[0][x].author.username, id: result[0][x].id, reputation: rep})
            }
            this.setState({
              comments: [result[1], cList]
            })
          }
        }
      )
  }

  setComments(parentID) {
    //console.log("ALL COMMENTS"+this.props.post.id+": "+JSON.stringify(this.getComments(parentID)))
    this.setState({
      comments: this.getComments(parentID)
    })
  }

  renderComments(comments){
    //console.log("comments"+this.props.post.id+": "+JSON.stringify(comments))
    if (comments[0] === 0){
      //console.log("SAD2-"+this.props.post.id)
      return
    }else{
      var elementList = []
      for(var x=0;x<comments[0];x++){
        const rep = comments[1][x].reputation;
        const postID = comments[1][x].id;
        //console.log("postID"+postID+"-rep"+rep)
        elementList.push(
          <div className="comment" key={x}>
            <div className="commentInterations">
              <div className={this.commentUp(rep)}>
                <img src={upArrow} className={(rep === 1) ? 'arrowsLitC' : 'arrowsC'} onClick={event => this.likeComment(postID)} alt={rep}/>
              </div>
              <div className={this.commentDown(rep)}>
                <img src={downArrow} className={(rep === -1) ? 'arrowsLitC' : 'arrowsC'} onClick={event => this.dislikeComment(postID)} alt={rep}/>
              </div>
            </div>
            <div>
              <div className="comment-author">
                <span className="comment-author-text">{comments[1][x].author}</span>
              </div>
              <div className="comment-text">
                {comments[1][x].comment}
              </div>
            </div>
          </div>)
      }
      return(<div>{elementList}</div>)
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
              <div className={this.isDown()}>
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
          <div>
            {this.renderComments(this.state.comments)}
          </div>
        </div>
      </div>
    );
  }
  //note: time removed from render because time is irrelevant, memes are timeless
}
