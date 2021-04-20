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
      listType: props.listType
    };
    this.postingList = React.createRef();
    this.loadPosts = this.loadPosts.bind(this);
  }

  componentDidMount() {

    this.loadPosts();

  }

  componentDidUpdate(prevProps) {
    console.log("PrevProps "+prevProps.refresh);
    console.log("Props "+this.props.refresh);
    if (prevProps.refresh !== this.props.refresh){
      this.loadPosts();
    }
  }

  // filterBlocked(posts) {
  //   //if (this.state.posts) {
  //     // get name of logged in user
  //     let username = "";
      

  //     // this.setState({
  //     //   isLoaded: true,
  //     //   posts: filteredPosts
  //     // })
  //     return filteredPosts;
  //   //}
  // }

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
            let posts = result[0];

            // if not logged in, load posts normally
            if (!sessionStorage.getItem("user")) {
              this.setState({
                isLoaded: true,
                posts: posts
              });

              return;
            }

            // if logged in filter blocked username
            let username = "";
            fetch(process.env.REACT_APP_API_PATH+"/users/" + sessionStorage.getItem("user"), {
              method: "get",
              headers: {
                "Content-Type": "application/json"
              }
            })
            .then(res => res.json())
            .then(result => {
              username = result.username;
              console.log("username: ", username)

              let filteredPosts = []
              for (let i = 0; i < posts.length; i++) {
                let post = posts[i]
                console.log("in posting list: ", post.id);
                fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID=" + posts[i].id + "&type=blocking" + "&name=" + username, {
                  method: "get",
                  headers: {
                    "Content-Type": "application/json"
                  }
                })
                .then(res => res.json())
                .then(result => {
                  if (result[1] == 0) {
                    filteredPosts.push(post)
                  }
                })
                .then(() => {
                  this.setState({
                    isLoaded: true,
                    posts: filteredPosts
                  });
                })
              }
            })
            
            // end filter blocked username

            
            

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
      )
      // .then(result => {
      //   this.setState({
      //     isLoaded: true,
      //     posts: result
      //   })

      //   console.log("filtered: ", this.state.posts);


      // });
  }

  render() {
    
    //this.loadPosts();
    const {error, isLoaded, posts} = this.state;
    if (error) {
      return <div> Error: {error.message} </div>;
    } else if (!isLoaded) {
      return <div> Loading... </div>;
    } else if (posts) {
      console.log("rendering....", posts.length);
      if (posts.length > 0){
      return (

        <div className="posts">

          {posts.map(post => (
            <Post key={post.id} post={post} type={this.props.type} loadPosts={this.loadPosts}/>
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
