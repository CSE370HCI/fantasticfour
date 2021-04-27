import React from "react";
import "../App.css";
import "./styles/Post.css"
import CommentForm from "./CommentForm.jsx";
import EditComment from "./EditComment.jsx"
import deleteIcon from "../assets/delete.png";
import commentIcon from "../assets/comment.svg";
import upArrow from "../assets/UpArrow.svg";
import downArrow from "../assets/DownArrow.svg";
import { parseConfigFileTextToJson, resolveModuleName } from "typescript";
import {stateFromMarkdown} from 'draft-js-import-markdown';
import {convertToRaw, Editor, EditorState, RichUtils} from 'draft-js';

export default class CommentDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: 1,
      dislikes: 0,
      userreaction: 0,
      showModalE: false,
    };
    this.post = React.createRef();

  }

  componentDidMount() {
    this.getCommentReaction(this.props.post.id)
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
                this.setState({
                    userreaction: 0
                })
              //console.log("Value 0 for post "+postID)
              return 0;
            }else if(result[0][0].name === "upvote"){
                this.setState({
                    userreaction: 1
                })
              //console.log("Value 1 for post "+postID)
              return 1;
            }else {
                this.setState({
                    userreaction: -1
                })
              //console.log("Value -1 for post "+postID)
              return -1;
            }
          },
          error => {
            console.log("Bad request received.")
          }
      )
    }
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
  if(sessionStorage.getItem("user") != null){
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
              ).then(
                this.setState({
                  userreaction: 1
                })
              )
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

  dislikeComment(postID){
  if(sessionStorage.getItem("user") != null){
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
            ).then(
                this.setState({
                  userreaction: -1
                })
              )
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

  // we only want to expose the delete post functionality if the user is
  // author of the post
  showDelete(){
    if (this.props.post.author.id == sessionStorage.getItem("user")) {
      return(
      <img
        src={deleteIcon}
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
      return "upButtonLitC"
    }else if(this.state.userreaction === 0){
      return "upButtonC"
    }else{
      return "greyButtonC"
    }
    }
  }

  isDown(){
  if(sessionStorage.getItem("user") != null){
    if(this.state.userreaction === -1){
      return "downButtonLitC"
    }else if(this.state.userreaction === 0){
      return "downButtonC"
    }else{
      return "greyButtonC"
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

  showLikes() {
    if (this.props.source === 'popular'){
      return <dic>Upvotes: {this.props.post.upvotes}</dic>
    }
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


  displayEdit(){
    if (this.props.userid == sessionStorage.getItem("user")) {
      return(
        <div className={this.showHideEdit()}>
            <EditComment
              onAddComment={this.setCommentCount}
              postid={this.props.postid}
              content={this.props.post.content}
            />
          </div>
    );
    }
    return "";
  }

  showEdit(){

      return(
        <div className="comment-indicator-text" onClick={e => this.showModalE()}>
            Edit
        </div>
    )
  }

  render() {
    var rep = this.state.userreaction
    var postID = this.props.post.id
    const comment_text = EditorState.createWithContent(stateFromMarkdown(this.props.post.content))
    return (
        <div className="comment" key={postID}>
            <div className="commentInterations">
              <div className={this.commentUp(rep)} onClick={event => this.likeComment(postID)}>
                <img src={upArrow} className={(rep === 1) ? 'arrowsLitC' : 'arrowsC'} alt={rep}/>
              </div>
              <div className={this.commentDown(rep)} onClick={event => this.dislikeComment(postID)}>
                <img src={downArrow} className={(rep === -1) ? 'arrowsLitC' : 'arrowsC'} alt={rep}/>
              </div>
            </div>
            <div className="comment-body">
              <div className="comment-author">
                <span className="comment-author-text">{this.props.author}</span>
                {this.showEdit()}
              </div>
              <div className="comment-text">
                <Editor editorState={comment_text} readOnly="true" className="editor-comment"/>
              </div>
              {this.displayEdit()}
            </div>
          </div>
  )
    }
  //note: time removed from render because time is irrelevant, memes are timeless
}
