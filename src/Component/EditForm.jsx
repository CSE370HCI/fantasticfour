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
      canIPost: false,
      privacy: "",
      currentAllowing: [],
      allowing: [],
      userAlreadyBlocked: false,
      usernameInvalid: false,
      privacyID: "",
      postID: this.props.post.id
    };
    this.postListing = React.createRef();
  }

  componentDidMount() {
    this.checkPrivacy()
  }

  async checkPrivacy() {
    // check if post has specific (limited view) privacy option
    const getPostTags = await fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.props.post.id+"&userID="+sessionStorage.getItem("user")+"&name=specific", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
    })

    const postTagsResults = await getPostTags.json()

    if (postTagsResults[1] > 0) {
      this.setState({
        privacy: "specific",
        privacyID: postTagsResults[0][0].id
      })
    }
    else {
      this.setState({
        privacy: ""
      })
    }

    this.populateAllowing()
  }

  async populateAllowing() {
    const getPostTags = await fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.props.post.id+"&userID="+sessionStorage.getItem("user")+"&type=allowing", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
    })

    const postTagsResults = await getPostTags.json()

    let currentAllowing = []

    postTagsResults[0].forEach(tag => {
      currentAllowing.push(tag)
    })

    if (currentAllowing.length == 0) {
      this.setState({
        privacy: "",
        currentAllowing
      })
      this.deletePrivacyTag()
    }
    else {
      this.setState({
        currentAllowing
      })
    }

    this.state.allowing.length && console.log("Allowing: ", this.state.currentAllowing)
  }

  async addAllowingTag() {
    if (this.state.privacy === "") {
      // add privacy tag
      fetch(process.env.REACT_APP_API_PATH+"/post-tags", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
        },
        body: JSON.stringify({
            postID: this.state.postID,
            userID: sessionStorage.getItem("user"),
            name: "specific",
            type: "privacy"
        })
      })
      .then(res => res.json())
      .then(result => {
        this.setState({
          privacy: "specific"
        })
      })
    }
    
    let allowedUsers = this.state.allowing
    if (allowedUsers.length > 0) {
      for (let i = 0; i < allowedUsers.length; i++) {
        this.state.currentAllowing.forEach(currentAllowing => {
          if (currentAllowing.name == allowedUsers[i]) {
            this.setState({
              allowing: [],
              userAlreadyBlocked: true
            })
            //alert("User alraady blocked! Try again.")
            return
          }
        })
        if (!this.state.userAlreadyBlocked) {
          if (await this.usernameIsValid(allowedUsers[i])) {
            // add allowing tag
            fetch(process.env.REACT_APP_API_PATH+"/post-tags", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
              },
              body: JSON.stringify({
                  postID: this.state.postID,
                  userID: sessionStorage.getItem("user"),
                  name: allowedUsers[i],
                  type: "allowing"
              })
            })
            .then(res => res.json())
            .then(result => {
              // redirects users back to the posts screen
              window.location.href = "homepage"
            })
          }
          else {
            this.setState({
              usernameInvalid: true
            })
          }
        }
      }
    }
    else {
      window.location.href = "homepage"
    }
    
    // if (!this.state.userAlreadyBlocked) {
    //   window.location.href = "homepage"
    // }
  }

  async usernameIsValid(name) {
    return fetch(process.env.REACT_APP_API_PATH+"/users?username="+name, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
    })
    .then(res => res.json())
    .then(result => {
      if (result[1] === 0) {
        return false
      }
      else {
        return true
      }
    })
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
                this.props.updateTitle(this.state.post_title)
                // redirects users back to the posts screen
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

  updateAllowing = event => {
    this.setState({
      usernameInvalid: false,
      userAlreadyBlocked: false,
      allowing: event.target.value.replace(/\s+/g, '').split(',') // parses the provided input and creates an array by splitting up names at commas
    })

    console.log("allowing field: ", this.state.allowing)
  }

  async deleteAllowing(event, allowingID) {
    event.preventDefault()
    console.log("Delete user for this post: ", this.state.postID)

    fetch(process.env.REACT_APP_API_PATH+"/post-tags/"+allowingID, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
    })
    .then(res => {
      console.log("Delete allowing tag status " + res.status)
      this.checkPrivacy()
    })
  }

  deletePrivacyTag() {
    // console.log("In delete privacy tag, postID " + this.state.postID + " privacy " + this.state.privacy + " privacy ID " + this.state.privacyID)
    if (this.state.postID && this.state.privacy === "" && this.state.privacyID) {
      fetch(process.env.REACT_APP_API_PATH+"/post-tags/"+this.state.privacyID, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
        }
      })
      .then(res => {
        console.log("Delete privacy tag status " + res.status)
      })
    }
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
          Limit View to
          <div className="allowing-box">
            {this.state.currentAllowing.map(user => (
              <div key={user.id} className="allowing-button">
                <button onClick={(event) => this.deleteAllowing(event, user.id)}>X</button>
                <p>{user.name}</p>
              </div>
            ))}
          </div>
          
          <input type="text" placeholder="Usernames to whitelist" onChange={this.updateAllowing}
            style={{
              padding: "6px 6px"
            }}
          />
          {this.state.userAlreadyBlocked &&
            <p className="error-message">⚠ User is already blocked, try typing a name that is not on the list</p>
          }
          {this.state.usernameInvalid && 
            <p className="error-message">⚠ Username does not exist</p>
          }
          <br/>
          <input className="submit-button" type="submit" value="submit" />
          <br/>
          {this.state.post_message}
        </form>
      </div>
    );
  }
}
