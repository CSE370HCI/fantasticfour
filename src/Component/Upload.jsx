import React from "react";
import "../App.css";
import "./styles/Upload.css";

//The post form component holds both a form for posting, and also the list of current posts in your feed
export default class Upload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post_title: "",
      post_message: "",
      post_URL: "",
      post_id: "",
      tag: "",
      restrictedTo: [],
      picture_preview: "",
      is_invalid_title: false,
      is_invalid_image: false,
      canIPost: false
    };
    this.postListing = React.createRef();
  }

  // the handler for submitting a new post.  This will call the API to create a new post.
  // while the test harness does not use images, if you had an image URL you would pass it
  // in the thumbnailURL field.
  submitHandler = event => {
      this.setState({
          is_invalid_title: false,
          is_invalid_image: false,
      });

    //keep the form from actually submitting via HTML - we want to handle it in react
    const fileField = document.querySelector('input[type="file"]');
    event.preventDefault();
    if (this.state.post_title.length == 0) {
        this.setState({
            is_invalid_title: true,
        });
    }
    else if (fileField.files[0] == null) {
        this.setState({
            is_invalid_image: true,
        });
    }
    else {
      this.state.canIPost = true;
    }
    if (this.state.canIPost) {
      //make the api call to post
      fetch(process.env.REACT_APP_API_PATH+"/user-artifacts", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ sessionStorage.getItem("token")
        },
        body: JSON.stringify({
          ownerID: sessionStorage.getItem("user"),
          type: "image",
          url: "https://e7.pngegg.com/pngimages/415/81/png-clipart-check-mark-error-s-text-photography.png",
          category: "post_image"
        })
      })
        .then(res => res.json())
        .then(result => {
          console.log(result);
          const formData = new FormData();
          formData.append("file", fileField.files[0]);
          fetch(process.env.REACT_APP_API_PATH+"/user-artifacts/" + result["id"] + "/upload", {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer '+ sessionStorage.getItem("token")
            },
            body: formData
          })
            .then(response => response.json())
            .then(result => {
              console.log('Success:', result);
              fetch(process.env.REACT_APP_API_PATH+"/posts", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                   'Authorization': 'Bearer '+sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                  authorID: sessionStorage.getItem("user"),
                  content: this.state.post_title,
                  type: "post",
                  thumbnailURL: "https://webdev.cse.buffalo.edu"+result["url"]
                })
              })
                .then(res => res.json())
                .then(
                  result => {
                    this.setState({
                      post_message: result.Status,
                      post_id: result["id"]
                    });
                    this.addTag(this.state.tag, result["id"])

                    // if whitelisted, perform appropriate requests and redirect
                    if (this.state.restrictedTo.length > 0) {
                      this.addAllowingTag(result["id"]); // function redirects to home after executing
                    }
                    else {
                      window.location.href = "home";
                    }
                  }
                );
              })
            .catch(error => {
              console.error('Error:', error);
            });
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

  addAllowingTag(postID) {
    let allowedUsers = this.state.restrictedTo
    for (let i = 0; i < allowedUsers.length; i++) {
      // add privacy tag
      fetch(process.env.REACT_APP_API_PATH+"/post-tags", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
        },
        body: JSON.stringify({
            postID: postID,
            userID: sessionStorage.getItem("user"),
            name: "specific",
            type: "privacy"
        })
      })
      .then(res => res.json())
      .then(result => {
        console.log("add privacy tag for post: ", postID)
      })

      // add allowing tag
      fetch(process.env.REACT_APP_API_PATH+"/post-tags", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
        },
        body: JSON.stringify({
            postID: postID,
            userID: sessionStorage.getItem("user"),
            name: allowedUsers[i],
            type: "allowing"
        })
      })
      .then(res => res.json())
      .then(result => {
        console.log("add allowing tag for user: ", allowedUsers[i])
        window.location.href = "home";
      })
    }
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

  updateRestrictedTo = event => {
    this.setState({
      restrictedTo: event.target.value.replace(/\s+/g, '').split(',') // parses the provided input and creates an array by splitting up names at commas
    })
  }


  updateFile = event => {
    const preview = new FileReader();
    preview.readAsDataURL(event.target.files[0]);
    preview.onloadend = event => {
      this.setState({
        picture_preview: preview.result,
        is_invalid_image: false,
      });
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
            <br/>
            Title*
            <br/>
            <input type="text" cols="70" className="upload-input" onChange={this.updateTitle} />
            {
                this.state.is_invalid_title ? (
                    <p className="error-message">⚠ Your post is missing a title!</p>
                ) : ""
            }
            <br/>
            <br/>
            <img src={this.state.picture_preview} alt="Upload Image" className="image-preview"/>
            {
                this.state.is_invalid_image ? (
                    <p className="error-message">⚠ Your post is missing an image!</p>
                ) : ""
            }
            <br/>
            <input type="file" id="myFile" name="filename" onChange={this.updateFile} className="fileUpload" accept=".png, .jpeg, .jpg, .gif"/>
            <br/>
            <br/>
            Communities
            <br/>
            <input type="text" cols="70" className="upload-input" onChange={this.updateTag} />
            <br/>
            <br/>
            Limit View
            <br/>
            <input type="text" className="upload-input" onChange={this.updateRestrictedTo} placeholder="Usernames to only allow"/>
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
