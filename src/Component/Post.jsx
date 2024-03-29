import React from "react";
import "../App.css";
import "./styles/Post.css"
import CommentForm from "./CommentForm.jsx";
import CommentDisplay from "./CommentDisplay.jsx"
import deleteIcon from "../assets/delete.png";
import commentIcon from "../assets/comment.svg";
import upArrow from "../assets/UpArrow.svg";
import downArrow from "../assets/DownArrow.svg";
import EditForm from "./EditForm.jsx"
import {Link} from 'react-router-dom';
import { createFalse, parseConfigFileTextToJson, resolveModuleName } from "typescript";
import {stateFromMarkdown} from 'draft-js-import-markdown';
import {convertToRaw, Editor, EditorState, RichUtils} from 'draft-js';

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showModalE: false,
      commentCount: this.props.post.commentCount,
      title: "",
      likes: 1,
      dislikes: 0,
      tags: [],
      userreaction: 0,
      comments: [], 
      newComment: false
    };
    this.post = React.createRef();
  }

  componentDidMount() {

    this.setState({
      title: this.props.post.content
    })
    this.getUserReaction()
    this.getComments(this.props.post.id)
  }

  componentDidUpdate(prevProps) {
    if (this.state.newComment === true){
      this.getComments(this.props.post.id)
      this.setState({
        newComment: false
      })
    }
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

  like(event) {
  if(sessionStorage.getItem("user") != null){
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

  addComment = newC => {
    this.showModal()
    const list = [newC, ...this.state.comments]
    this.setState({
      comments: list
    });
  };

  editTitle = newT => {
    this.showModalE()
    this.setState({
      title: newT
    })

  }

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

  showHideEdit() {
    if (this.state.showModalE) {
      return "comments show";
    }
    return "comments hide";
  }

  showModalE = e => {
    this.setState({
      showModalE: !this.state.showModalE
    });
  };

  deletePost = e => {
  console.log("Post Delete")
  const postID = this.props.post.id
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
          console.log("postindex: "+this.props.index)
          this.props.onDelete(this.props.index)
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
            <div className="">
              {this.showDelete()}
            </div>
            <img
              src={commentIcon}
              className="comment-icon"
              onClick={e => this.showModal()}
              alt="Make a Comment"
              tabIndex="0"
            />
            <div className="comment-indicator-text" onClick={e => this.showModal()} >
                Make a comment!
            </div>
          </div>
          <div className={this.showHideEdit()}>
            <EditForm
              onAddComment={this.setCommentCount}
              postid={this.props.post.id}
              commentCount={this.getCommentCount()}
              post={this.props.post}
              updateTitle={this.editTitle}
              onDelete={this.deletePost}
            />
          </div>
          <div className={this.showHideComments()}>
            <CommentForm
              onAddComment={this.setCommentCount}
              parent={this.props.post.id}
              commentCount={this.getCommentCount()}
              updateComments={this.addComment}
            />
          </div>
        </div>
      );
    //}
    } else {
    return (
        <div className="comment-block">
          <div className="comment-indicator">
          </div>
        </div>
          );
    }
  }

  // we only want to expose the delete post functionality if the user is
  // author of the post
  showDelete(){
    if (this.props.userid == sessionStorage.getItem("user")) {
      return(
        <div className="comment-indicator-text" onClick={e => this.showModalE()} tabIndex="0">
            Edit
        </div>
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
    fetch(process.env.REACT_APP_API_PATH+"/posts?sort=newest&parentID="+parentID, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json()
    ).then(
        result => {
          this.setState({
            comments: result[0],
            commentCount: result[1]
          });
        }
      )
  }


  showLikes() {
    if (this.props.source === 'popular'){
      return <dic>Upvotes: {this.props.post.upvotes}</dic>
    }
  }

  renderComments(){


  }

  render() {
    const comments = this.state.comments;
    if(sessionStorage.getItem("user") != null){
      if(comments[0] == null){
      return(
      <div className="post-comment-block">
              <div className="meme-side">
                <div>
                  <img src={this.props.post.thumbnailURL} className="meme" alt=""/>
                </div>
                <div className="memeStuff">
            <li className="post-info">
              <b className="meme-name"alt={this.state.title+" by "+this.props.username}>{this.state.title}</b>
              <b className="meme-by"> by </b>
              <Link to={"/profile/" + this.props.userid} className="meme-poster" style={{textDecoration: 'none'}} alt={this.props.username}>{this.props.username}</Link>
            </li>
            <br/>
            <div className="postInterations">
              <div className={this.isUp()} onClick={event => this.like(event)} >
                <img src={upArrow} className={(this.state.userreaction === 1) ? 'arrowsLit' : 'arrows'} alt={"like"+this.state.userreaction}/>
              </div>
              <div className={this.isDown()} onClick={event => this.dislike(event)} >
                <img src={downArrow} className={(this.state.userreaction === -1) ? 'arrowsLit' : 'arrows'} alt={"dislike"+this.state.userreaction}/>
              </div>
              <div className="comment-count-text">
                {this.state.commentCount} Comments
              </div>
            </div>
          </div>
              </div>
              <div  className="comment-side">
                {this.conditionalDisplay()}
                <div className="comment-invite" tabIndex="0">Now's your chance to make the first comment! </div>
              </div>
            </div>
            );
      } else {
    return (
      <div className="post-comment-block">
        <div className="meme-side">
          <div>
            <img src={this.props.post.thumbnailURL} className="meme" alt=""/>
          </div>
          <div className="memeStuff">
            <li className="post-info">
              <b className="meme-name"alt={this.state.title+" by "+this.props.username}>{this.state.title}</b>
              <b className="meme-by"> by </b>
              <Link to={"/profile/" + this.props.userid} className="meme-poster" style={{textDecoration: 'none'}} alt={this.props.username}>{this.props.username}</Link>
            </li>
            <br/>
            <div className="postInterations">
              <div className={this.isUp()} onClick={event => this.like(event)} >
                <img src={upArrow} className={(this.state.userreaction === 1) ? 'arrowsLit' : 'arrows'} alt={"like"+this.state.userreaction}/>
              </div>
              <div className={this.isDown()} onClick={event => this.dislike(event)} >
                <img src={downArrow} className={(this.state.userreaction === -1) ? 'arrowsLit' : 'arrows'} alt={"dislike"+this.state.userreaction}/>
              </div>
              <div className="comment-count-text">
                {this.state.commentCount} Comments
              </div>
            </div>
          </div>
        </div>
        <div  className="comment-side">
          <div className="comment-list">
            {this.conditionalDisplay()}
            {comments.map((post, index) => {
              if(this.props.blockedUsers && this.props.blockedUsers.includes(post.author.id)) {
                return
              }
              return (
                <CommentDisplay index={index} onDelete={this.deletePost} key={post.id} post={post} author={post.author.username} userid={post.author.id} postid={post.id} commentCount={this.getCommentCount()} onAddComment={this.setCommentCount}/>
              )
            }
            )}
          </div>
        </div>
      </div>
    );
    }
    } else {
      if(comments[0] == null){
            return (
                      <div className="post-comment-block">
                      <div className="meme-side">
                        <div>
                          <img src={this.props.post.thumbnailURL} className="meme" alt=""/>
                        </div>
                        <div className="memeStuff">
                          <li className="post-info">
                            <b className="meme-name">{this.state.title}</b>
                            <b className="meme-by"> by </b>
                            <Link to={"/profile/" + this.props.post.author.id} className="meme-poster" style={{textDecoration: 'none'}}>{this.props.username}</Link>
                          </li>
                          <br/>
                        </div>
                        <div className="comment-indicator-text">
                            {this.state.commentCount} Comments
                        </div>
                      </div>
                      <div  className="comment-side">
                      
                        <br/>
                        <div className="comment-invite">No comments yet. Sign in to speak your mind!</div>
                      </div>
                    </div>
                    )
      } else {
        return (
          <div className="post-comment-block">
            <div className="meme-side">
              <div>
                <img src={this.props.post.thumbnailURL} className="meme" alt=""/>
              </div>
              <div className="memeStuff">
                <li className="post-info" alt={this.state.title+" by "+ this.props.username}>
                  <b className="meme-name">{this.state.title}</b>
                  <b className="meme-by"> by </b>
                  <Link to={"/profile/" + this.props.post.author.id} className="meme-poster" style={{textDecoration: 'none'}}>{this.props.username}</Link>
                </li>
                <br/>
              </div>
              <div className="comment-count-text">
                {this.state.commentCount} Comments
              </div>
            </div>
            <div  className="comment-side">
              <div className="comment-list">
                {comments.map((post, index) => (
                  <CommentDisplay index={index} onDelete={this.deletePost} post={post} author={post.author.username} commentCount={this.getCommentCount()} onAddComment={this.setCommentCount}/>
                      ))}
              </div>
            </div>
          </div>
        )}
        }
      }
  //note: time removed from render because time is irrelevant, memes are timeless
}
