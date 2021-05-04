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
      tagsList: [],
      listType: props.listType
    };
    this.postingList = React.createRef();
    this.loadPosts = this.loadPosts.bind(this);
  }

  componentDidMount() {
    var tagsList = (this.props.match.params.tag_names).split("&")
    tagsList = [...new Set(tagsList)]
    this.setState({
      tagsList: tagsList
    })
    for (const [key, tag] of Object.entries(tagsList)){
      this.loadPosts(tag);
    }
    this.setState({
      isLoaded: true,
      posts: [...new Set(this.state.posts)]
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.refresh !== this.props.refresh){
      for (const [key, tag] of Object.entries(this.state.tagsList)){
        this.loadPosts(tag);
      }
      this.setState({
        isLoaded: true,
        posts: [...new Set(this.state.posts)]
      });
    }
  }

  loadPosts(tag_name) {
    let url = process.env.REACT_APP_API_PATH+"/post-tags?type=hashtag&name="+tag_name;
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
              if ((post.post.id !== 278 && post.name !== "admin") || !(post.post.id === 278 && post.user.id !==sessionStorage.getItem("user"))){
                if(this.existNot(post.post.id)){
                  filtered.push(post)
                }
              }
            }
            this.setState({
              posts: [...new Set(filtered.concat(this.state.posts))]
            });
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

  existNot(postid){
    for (const [key, post] of Object.entries(this.state.posts)){
      if (post.post.id === postid){
        return false
      }
    }
    return true
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
