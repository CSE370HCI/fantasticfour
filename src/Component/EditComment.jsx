import React from "react";
import "./styles/CommentForm.css"
import PostingList from "./PostingList.jsx";
import {convertToRaw, Editor, EditorState, RichUtils} from 'draft-js';
import { stateToMarkdown } from "draft-js-export-markdown";
import deleteIcon from "../assets/delete.png";

const styleMap = {
  'STRIKETHROUGH': {
    textDecoration: 'line-through',
  },
  'CLEAR': {
    textDecoration: 'none',
  }
};

export default class EditComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post_text: "",
      postmessage: "",
      editorState: EditorState.createEmpty()
    };
    this.postListing = React.createRef();
    this.onChange = editorState => this.setState({editorState});
  }

  submitHandler = event => {
    //keep the form from actually submitting
    event.preventDefault();

    //make the api call to the authentication page
    const markdown = stateToMarkdown(this.state.editorState.getCurrentContent())
    fetch(process.env.REACT_APP_API_PATH+"/posts/"+this.props.postid, {
      method: "patch",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        content: markdown
      })
    })
      .then(res => res.json())
      .then(
        result => {
          // update the count in the UI manually, to avoid a database hit
          console.log("Sent and receive: "+JSON.stringify(result))
          this.props.editComment(result.content)
        },
        error => {
          alert("error!");
          console.log("received bad")
        }
      );
  };

  onBold = (event) =>{
    event.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  onItalics = (event) =>{
    event.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  onUnderline = (event) =>{
    event.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }

  onCodify = (event) =>{
    event.preventDefault();
    //doesn't look like a code block, unused for now.
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'CODE'));
  }

  onStrike = (event) =>{
    event.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'STRIKETHROUGH'));
  }

  onClear = (event) =>{
    event.preventDefault();
    //doesn't work...
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'CLEAR'));
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
  if(sessionStorage.getItem("user") != null){
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <label>
            Edit Comment
          </label>
          <img
          src={deleteIcon}
          className="sidenav-icon deleteIcon"
          alt="Delete Post"
          title="Delete Post"
          onClick={e => this.deletePost(this.props.postid)}
        />
          <div>
              <button className="font-type-button" onClick={this.onBold.bind(this)}>Bold</button>
              <button className="font-type-button" onClick={this.onItalics.bind(this)}>Italics</button>
              <button className="font-type-button" onClick={this.onUnderline.bind(this)}>Underline</button>
              <button className="font-type-button" onClick={this.onStrike.bind(this)}>Strike</button>
          </div>
          <div className="commentBox">
            <Editor editorState={this.state.editorState} onChange={this.onChange} customStyleMap={styleMap} textAlignment='left' className="commentBox"/>
          </div>
          <input type="submit" value="submit" />
          <br />
          {this.state.postmessage}
        </form>
        
      </div>
    );
    } else {
    return (
      <div/>
    );
    }
  }
}
