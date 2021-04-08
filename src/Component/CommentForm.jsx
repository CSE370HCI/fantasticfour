import React from "react";
import "./styles/CommentForm.css"
import PostingList from "./PostingList.jsx";
import {convertToRaw, Editor, EditorState, RichUtils} from 'draft-js';
import { stateToMarkdown } from "draft-js-export-markdown";


export default class CommentForm extends React.Component {
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
    fetch(process.env.REACT_APP_API_PATH+"/posts", {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        authorID: sessionStorage.getItem("user"),
        content: markdown,
        parentID: this.props.parent,
        thumbnailURL: "",
        type: "post"
      })
    })
      .then(res => res.json())
      .then(
        result => {
          // update the count in the UI manually, to avoid a database hit
          console.log("Sent and receive: "+result.content)
          this.props.onAddComment(this.props.commentCount + 1);
        },
        error => {
          alert("error!");
          console.log("received bad")
        }
      );
  };

  onBoldClick = (event) =>{
    event.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  onItalicsClick = (event) =>{
    event.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  onUnderlineClick = (event) =>{
    event.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }

  render() {
  if(sessionStorage.getItem("user") != null){
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <label>
            Add A Comment to Post
          </label>
          <div>
              <button onClick={this.onBoldClick.bind(this)}>Bold</button>
              <button onClick={this.onItalicsClick.bind(this)}>Italics</button>
              <button onClick={this.onUnderlineClick.bind(this)}>Underline</button>
          </div>
          <Editor editorState={this.state.editorState} onChange={this.onChange} className="commentBox"/>
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
