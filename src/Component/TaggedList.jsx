import React from "react";
import Post from "./Post.jsx";
import TagsBlock from "./TagsBlock.jsx";
import {Link} from 'react-router-dom';
import "./styles/PostingList.css";

export default class TaggedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      posts: [],
      listType: props.listType
    };
    this.postingList = React.createRef();
    this.loadPosts = this.loadPosts.bind(this);
  }

  componentDidMount() {
    console.log("FOUND TAGGEDLIST")
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
    let url = process.env.REACT_APP_API_PATH+"/post-tags?type=hashtag&name="+this.props.match.params.tag_name;
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
            var filtered = []
            for (const [key, post] of Object.entries(result[0])){
              if ((post.post.id !== 4 && post.name !== "helloworld") || !(post.post.id === 4 && post.user.id !==sessionStorage.getItem("user"))){
                filtered.push(post)
              }
            }
            console.log("filtered: "+JSON.stringify(filtered))
            this.setState({
              isLoaded: true,
              posts: filtered
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
    console.log("TAG!! "+ this.props.match.params.tag_name)
    //this.loadPosts();
    const {error, isLoaded, posts} = this.state;
    if (error) {
      return <div> Error: {error.message} </div>;
    } else if (!isLoaded) {
      return <div> Loading... </div>;
    } else if (posts) {

      if (posts.length > 0){
        console.log("posts: "+JSON.stringify(this.state.posts))
      return (
        <div className="post-feed">
          <div className="posting-block">
            <div className="posts">
          {posts.map(post => (
            <Post key={post.id} post={post.post} type={this.props.type} loadPosts={this.loadPosts} username={post.user.username} userid={post.user.id}/>
            ))}
            </div>
          </div>
          <div className="right-background"/>
          <div className="column-view">
            <div className="upload-button">
              <Link to="/upload" className="upload-button-text">
                Upload a Post
              </Link>
          </div>
          <div className="tagBlock">
            <TagsBlock />
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
