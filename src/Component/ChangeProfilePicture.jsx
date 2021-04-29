import React from "react";
import "../App.css";

export default class ChangeProfilePicture extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      picture_URL: "",
      picture_File: null,
      can_upload: false,
      profile_picture: "",
      picture_preview: null
    };
  }

  componentDidMount(){
  fetch(process.env.REACT_APP_API_PATH+"/user-artifacts?ownerID=" + sessionStorage.getItem("user") + "&category=profile_picture", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("token")
          }
        })
          .then(res => res.json())
          .then(
            result => {
              if(sessionStorage.getItem("user") != null){
                this.setState({
                  profile_picture: result[0][0]["id"]
                });
                console.log(this.state.profile_picture);
              }
            }
          );
  }
  submitHandler = event => {
    const fileField = document.querySelector('input[type="file"]');
    //keep the form from actually submitting via HTML - we want to handle it in react
    event.preventDefault();
    if (fileField.files[0] == null){
      alert("You need to include an image to continue")
    } else {
      this.state.can_upload = true;
    }
    if (this.state.can_upload) {
      //make the api call to update picture

      const formData = new FormData();
      formData.append("file", fileField.files[0]);
      fetch(process.env.REACT_APP_API_PATH+"/user-artifacts/" + this.state.profile_picture + "/upload", {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+ sessionStorage.getItem("token")
        },
        body: formData
      })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
        window.location.href = "profileinfo";
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  };

  updateFile = event => {
    const preview = new FileReader();
    preview.readAsDataURL(event.target.files[0]);
    preview.onloadend = event => {
      this.setState({
        picture_preview: preview.result
      });
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <img src={this.state.picture_preview} alt="Upload Image" className="user-profile-picture"/>
          <br/>
          <input type="file" id="myFile" name="filename" onChange={this.updateFile} className="fileUpload" accept=".png, .jpeg, .jpg, .gif"/>
          <br/>
          <br/>
          <input className="submit-button" type="submit" value="Confirm" />
        </form>
      </div>
    );
  }
}
