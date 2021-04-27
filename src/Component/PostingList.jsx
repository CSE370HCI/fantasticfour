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

  // returns promise of username of account currently logged in (needs "await" keyword when calling to get the result of promise)
  async getLoggedInUser() {
    return fetch(process.env.REACT_APP_API_PATH+"/users/" + sessionStorage.getItem("user"), {
      method: "get",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(result => result.username)
    .catch(err => console.log(err))
  }

  // filters and returns a list from a list of posts
  async filterPosts(posts) {
    let filteredPosts = [];

    // get fulfilled value of Promise
    const username = await this.getLoggedInUser();

    for (let i = 0; i < posts.length; i++) {
      // check to see if logged in user exists in list of users being blocked for specific post
      const get = await fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID=" + posts[i].id + "&type=blocking" + "&name=" + username, {
        method: "get",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const result = await get.json()

      if (result[1] == 0) { // not being blocked
        filteredPosts.push(posts[i])
      }
    }

    return filteredPosts
  }

  async loadPosts() {
    let url = process.env.REACT_APP_API_PATH+"/posts?parentID=";
    if (this.props && this.props.parentid){
      url += this.props.parentid;
    }
    const get = await fetch(url, {
      method: "get",
      headers: {
        'Content-Type': 'application/json'

      },

    })
    const res = await get.json()
    let posts = res[0];

    // filter posts and return
    posts = await this.filterPosts(posts)

    console.log(posts);

    this.setState({
      isLoaded: true,
      posts
    })
    
      // uncomment start

      // .then(
      //   result => {
      //     if (result) {
      //       let posts = result[0];

      //       // if not logged in, load posts normally
      //       if (!sessionStorage.getItem("user")) {
      //         this.setState({
      //           isLoaded: true,
      //           posts: posts
      //         });

      //         return;
      //       }

      //       // if logged in filter blocked username
            
      //       const username = this.getLoggedInUser();
            
      //       console.log(username);

      //       //   let filteredPosts = []
      //       //   for (let i = 0; i < posts.length; i++) {
      //       //     let post = posts[i]
      //       //     console.log("in posting list: ", post.id);
      //       //     fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID=" + posts[i].id + "&type=blocking" + "&name=" + username, {
      //       //       method: "get",
      //       //       headers: {
      //       //         "Content-Type": "application/json"
      //       //       }
      //       //     })
      //       //     .then(res => res.json())
      //       //     .then(result => {
      //       //       if (result[1] == 0) {
      //       //         filteredPosts.push(post)
      //       //       }
      //       //     })
      //       //     .then(() => {
      //       //       this.setState({
      //       //         isLoaded: true,
      //       //         posts: filteredPosts
      //       //       });
      //       //     })
      //       //   }
      //       // })
            
      //       // end filter blocked username

            
            

      //       console.log("Got Posts");
      //     }
      //   },
      //   error => {
      //     this.setState({
      //       isLoaded: true,
      //       error
      //     });
      //     console.log("ERROR loading Posts")
      //   }
      // )

      // .then(result => {
      //   this.setState({
      //     isLoaded: true,
      //     posts: result
      //   })

      //   console.log("filtered: ", this.state.posts);


      // });

      // uncomment end
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
