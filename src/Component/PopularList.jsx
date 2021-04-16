import React from "react";
import Post from "./Post.jsx";
import "./styles/PostingList.css";

export default class PostingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      posts: [],
      postLikes: [],
      listType: props.listType,
      size: 0,
      isSorted: false
    };
    this.postingList = React.createRef();
    this.loadPosts = this.loadPosts.bind(this);
  }

  componentDidMount() {

    this.loadPosts();

  }

  componentDidUpdate(prevProps) {
    //console.log("PrevProps "+prevProps.refresh);
    //console.log("Props "+this.props.refresh);
    if (prevProps.refresh !== this.props.refresh){
      this.loadPosts();
      if (this.state.isSorted === false && this.state.isLoaded === true && this.state.posts[0].upvotes !== undefined){
          console.log("TIME TO REALLY SORT")
        this.sortPopularity()
        }
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
              posts: result[0],
              size: result[1]
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
      ).then(
          result => {
            this.fetchPopularity()
            }
      ).then(() =>{
        this.setState({
            isLoaded: true
        })
      })
      
  }

    fetchPopularity() {
        var list = this.state.posts
        var tlist = []
        var size = 0
        list.forEach(post_t => {
                    fetch(process.env.REACT_APP_API_PATH+"/post-tags?name=upvote&type=reaction&postID="+post_t.id, {
                        method: "GET",
                        headers: {
                        'Authorization': 'Bearer '+sessionStorage.getItem("token")
                        }
                    }).then(res => res.json()
                    ).then(
                        result => {
                            post_t['upvotes'] = result[1]
                            tlist = this.state.postLikes
                            size += 1
                            tlist.push(post_t)
                            this.setState({
                                postLikes: tlist
                            })
                        }
                    ).then( () => {
                        if(size === this.state.size){
                            this.sortPopularity()
                        }
                    }
                    )
            })

    }


  sortPopularity() {
    var list = this.state.posts
    list.sort((a, b) => b.upvotes - a.upvotes);
    this.setState({
        posts: list
    })
}


  render() {
    const {error, isLoaded, posts} = this.state;
    if (error) {
      return <div> Error: {error.message} </div>;
    } else if (!isLoaded) {
      return <div> Loading... </div>;
    } else if (posts) {

      if (posts.length > 0){
        return (

        <div className="posts">

            {posts.map(post => (
            <Post key={post.id} post={post} type={this.props.type} loadPosts={this.loadPosts} source='popular'/>
            ))}

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
