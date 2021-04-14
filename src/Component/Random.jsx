import React from "react";
import "../App.css";
import "./styles/UserProfile.css";

//The post form component holds both a form for posting, and also the list of current posts in your feed
export default class Random extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      title: "",
      imageURL: ""
    };
    this.postListing = React.createRef();
  }

  componentDidMount() {
      let tempPostIDHolder = [];
    fetch(process.env.REACT_APP_API_PATH+"/posts", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    })
        .then(res => res.json())
        .then(
            result => {
                for(const post of result[0]) {
                    if(post["parent"] == null) {
                        tempPostIDHolder.push(post);
                    }
                }
            }
        )
        .then ( () => {
            let post = tempPostIDHolder[Math.floor(Math.random() * tempPostIDHolder.length)];
            this.setState({
                username: post["author"]["username"],
                title: post["content"],
                imageURL: post["thumbnailURL"]
            });
        })

  }

  render() {
    return (
        <div>
            {this.state.username}
            {this.state.title}
          <img src={this.state.imageURL} alt="profile picture" className="user-profile-picture"/>
        </div>
    );
  }
}
