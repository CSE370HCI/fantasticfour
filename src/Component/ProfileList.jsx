import React from "react";
import Post from "./Post.jsx";
import "./styles/PostingList.css";
import ProfileBlock from "./ProfileBlock.jsx";

export default class ProfileList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      posts: [],
      listType: props.listType,
      user_id: sessionStorage.getItem("user")
    };
    this.postingList = React.createRef();
    this.loadPosts = this.loadPosts.bind(this);
  }

  componentDidMount() {
    var user_id = this.props.match.params.user_id
    this.setState({
      user_id: user_id
    })
    this.loadPosts();
  }

  componentDidUpdate(prevProps) {
    console.log("PrevProps "+prevProps.refresh);
    console.log("Props "+this.props.refresh);
    if (prevProps.refresh !== this.props.refresh){
      this.loadPosts();
    }
  }

  loadPosts() {
    let url = process.env.REACT_APP_API_PATH+"/posts?parentID=";
    if (this.props && this.props.parentid){
      url += this.props.parentid;
    }
    fetch(url, {
      method: "get",
      headers: {
        'Content-Type': 'application/json'

      },

    })
      .then(res => res.json())
      .then(
        result => {
          if (result) {
            this.setState({
              isLoaded: true,
              posts: result[0]
            });
            console.log("Got Posts");
          }
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
          console.log("ERROR loading Posts")
        }
      );
  }

  render() {
    //this.loadPosts();
    const {error, isLoaded, posts} = this.state;
    if (error) {
      return <div> Error: {error.message} </div>;
    } else if (!isLoaded) {
      return <div> Loading... </div>;
    } else if (posts) {

      if (posts.length > 0){
      return (
        <div>
        <div className="posting-block">
          <div className="posts">
            {posts.map(post => (post.author.id == this.state.user_id) ?
            (<Post key={post.id} post={post} type={this.props.type} loadPosts={this.loadPosts} username={post.author.username} userid={post.author.id}/>):
            (<span/>))
            }
          </div>
        </div>
        <div>
          <div className="right-background"/>
            <div className="column-view">
              <div className="tagBlock">
                <ProfileBlock id={this.state.user_id}/>
              </div>
            </div>
          </div>
        </div>



      );
      } else {
          return (<div> No Posts Found </div>);
        }
    } else {
        return <div> *cricket noises (no posts yet)* </div>;
      }
  }
}
