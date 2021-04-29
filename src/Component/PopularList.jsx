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
      isSorted: false,
      blockedUsers: []
    };
    this.postingList = React.createRef();
    this.loadPosts = this.loadPosts.bind(this);
  }

  componentDidMount() {

    this.loadPosts();
    this.loadBlockedUsers();
  }

  componentDidUpdate(prevProps) {
    //console.log("PrevProps "+prevProps.refresh);
    //console.log("Props "+this.props.refresh);
    if (prevProps.refresh !== this.props.refresh){
      this.loadPosts();
      // if (this.state.isSorted === false && this.state.isLoaded === true && this.state.posts[0].upvotes !== undefined){
      //     console.log("TIME TO REALLY SORT")
      //   this.sortPopularity()
      //   }
    }
  }
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

    // if logged in
    if (sessionStorage.getItem("user")) {
      // get fulfilled value of Promise
      const username = await this.getLoggedInUser();

      // check for posts that have not been blocked from logged in user
      for (let i = 0; i < posts.length; i++) {

        // check for specific audience
        // if so, then check if allowed for logged in user then add to render
        const privacy = await fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID=" + posts[i].id + "&type=privacy" + "&name=specific", {
          method: "get",
          headers: {
            "Content-Type": "application/json"
          }
        })
        const privacyResult = await privacy.json();

        if (privacyResult[1] > 0) {
          const allowing = await fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID=" + posts[i].id + "&type=allowing" + "&name=" + username, {
            method: "get",
            headers: {
              "Content-Type": "application/json"
            }
          })
          const allowingResult = await allowing.json();

          if (allowingResult[1] == 0 && posts[i].author.username != username) { // list empty AND user not author, not allowed for logged in user
            continue;
          }
        }

        const blocking = await fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID=" + posts[i].id + "&type=blocking" + "&name=" + username, {
          method: "get",
          headers: {
            "Content-Type": "application/json"
          }
        })
        const blockingResult = await blocking.json(); // if blockingResult[1] == 0, not being blocked for logged in user
  
        if (blockingResult[1] == 0 && !this.isOnBlocklist(posts[i].author.id)) { // not being blocked
          filteredPosts.push(posts[i])
        }
      }
    }
    // not logged in
    else {
      // filter out posts with privacy tag "specific"
      for (let i = 0; i < posts.length; i++) {
        const specific = await fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID=" + posts[i].id + "&type=privacy" + "&name=specific", {
          method: "get",
          headers: {
            "Content-Type": "application/json"
          }
        })
        const specificResult = await specific.json();
  
        if (specificResult[1] == 0) { // not limited audience
          filteredPosts.push(posts[i])
        }
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
      posts,
      size: res[1]
    })
    await this.fetchPopularity()
  }

  // returns boolean for presence of post author in the blocklist for logged in user
  isOnBlocklist(authorID) {
    //this.loadBlockedUsers();
    if (this.state.blockedUsers)
      return this.state.blockedUsers.includes(authorID);
    else
      return false;
  }

  // loadPosts() {
  //   let url = process.env.REACT_APP_API_PATH+"/posts?parentID=";
  //   if (this.props && this.props.parentid){
  //     url += this.props.parentid;
  //   }
  //   fetch(url, {
  //     method: "get",
  //     headers: {
  //       'Content-Type': 'application/json'

  //     },

  //   })
  //     .then(res => res.json())
  //     .then(
  //       result => {
  //         if (result) {
  //           this.setState({
  //             posts: result[0],
  //             size: result[1]
  //           });
  //           console.log("Got Posts");
  //         }
  //       },
  //       error => {
  //         this.setState({
  //           isLoaded: true,
  //           error
  //         });
  //         console.log("ERROR loading Posts")
  //       }
  //     ).then(
  //         result => {
  //           this.fetchPopularity()
  //           }
  //     ).then(() =>{
  //       this.setState({
  //           isLoaded: true
  //       })
  //     })
  // }

    async fetchPopularity() {
        let list = this.state.posts
        
        for (let i=0; i < this.state.posts.length; i++) {
          const getPostTags = await fetch(process.env.REACT_APP_API_PATH+"/post-tags?name=upvote&type=reaction&postID="+list[i].id, {
            method: "GET",
            headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
          })

          const postTagsResults = await getPostTags.json()
          const upvotes = postTagsResults[1]
          list[i].upvotes = upvotes
        }

        this.setState({
          posts: list
        })

        this.sortPopularity()

        // list.forEach(post_t => {
        //             fetch(process.env.REACT_APP_API_PATH+"/post-tags?name=upvote&type=reaction&postID="+post_t.id, {
        //                 method: "GET",
        //                 headers: {
        //                 'Authorization': 'Bearer '+sessionStorage.getItem("token")
        //                 }
        //             }).then(res => res.json()
        //             ).then(
        //                 result => {
        //                     post_t['upvotes'] = result[1]
        //                     size += 1
        //                 }
        //             ).then( () => {
        //                 // if(size === this.state.size){
        //                 //     this.sortPopularity()
        //                 // }
        //                 this.sortPopularity()
        //             }
        //             )
        //     })

    }


  sortPopularity() {
    var list = this.state.posts

    list.sort((a, b) => b.upvotes - a.upvotes);
    this.setState({
        posts: list,
        isLoaded: true
    })
}

async loadBlockedUsers() {
  console.log("loading blocked users for user: ", sessionStorage.getItem("user"))

  // check if block list exists, if not, no blocked users.
  const getGroups = await fetch(process.env.REACT_APP_API_PATH+"/groups?ownerID=" + sessionStorage.getItem("user") + "&name=block", {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
  })

  const groupsResult = await getGroups.json()

  let blockListID = 0
  if (groupsResult[1] === 1) {
      blockListID = groupsResult[0][0].id

      this.setState({
          blocklistID: blockListID,
          noBlockedList: false
      })
      // load group members into blockedUsers array
      this.loadMembers(blockListID)
  }
  else {
      this.setState({
          noBlockedList: true
      })
  }
  console.log("group id: ", blockListID)
}

async loadMembers(id) {
  console.log("In load members with id: ", id)
  const getGroupMembers = await fetch(process.env.REACT_APP_API_PATH+"/group-members?groupID=" + id, {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
  })

  const groupMembersResults = await getGroupMembers.json()

  let users
  if (groupMembersResults[1] > 0) {
      console.log(groupMembersResults[0])
      users = groupMembersResults[0]

      let blockedUsers = []
      for (let i = 0; i < groupMembersResults[1]; i++) {
          blockedUsers.push(users[i].user.id)
      }

      this.setState({
          blockedUsers: blockedUsers
      })
  }
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
            <Post key={post.id} post={post} type={this.props.type} loadPosts={this.loadPosts} loadPosts={this.loadPosts} username={post.author.username} userid={post.author.id} source='popular' blockedUsers={this.state.blockedUsers}/>
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
