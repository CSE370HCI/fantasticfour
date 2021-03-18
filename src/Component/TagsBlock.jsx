import React from "react";

import "../App.css";

export default class TagsBlock extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          type: "post",
          list: [],
          id: 0,
          addClicked: false,
          tempTag: ''
        };
        this.tagblock = React.createRef();
    }

    componentDidMount() {
        this.getTags()
    }

    getTags(){
        fetch(process.env.REACT_APP_API_PATH+"/post-tags?userID="+sessionStorage.getItem("user")+"&type=hashtag", {
            method: "GET",
            headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
          }).then(res => res.json()
          ).then(
              result => {
                  this.saveTags(result);
                  }
          )
    }

    saveTags(result){
        var taglist = []
        const count = result[1];
        const list = result[0];
        for(var i=0;i<count;i++){
            taglist.push(list[i].name);
        }
        this.setState({
            list: taglist
        })
    }

    setType(input){
        this.setState({
            type: input
        });
        if(input === "post"){
            fetch(process.env.REACT_APP_API_PATH+"/post-tags?postID="+this.state.id, {
                method: "GET",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer '+sessionStorage.getItem("token")
                }
                }
            ).then(
                res => res.json()
            ).then(
                result => {
                    this.setState({
                        list: result.tags
                    });
                },
                error => {
                    alert("error!");
                }
            );
        }else if(input === "user"){
            fetch(process.env.REACT_APP_API_PATH+"/post-tags?userID="+sessionStorage.getItem("user"), {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+sessionStorage.getItem("token")
                }
                }
            ).then(
                res => res.json()
            ).then(
                result => {
                    this.setState({
                        list: result.list
                    });
                },
                error => {
                    alert("error!");
                }
            );
        }
    }

    changeClick(tag){
        if(this.state.changeClick===true){
            this.setState({
                changeClick: false
            });
        }else{
            this.addTag(tag);
            this.setState({
                changeClick: true
            });
        }
    }

    hasTag(result, tag){
        const count = result[1];
        const list = result[0];
        for(var i=0; i<count;i++){
            if(list[0].name === tag){
                return true;
            }
        }
        return false;
    }

    addTag = (event) => {
        var tag = this.state.tempTag;
        if(tag.charAt(0) === '#'){
            tag = tag.substring(1);
          }
        fetch(process.env.REACT_APP_API_PATH+"/post-tags?userID="+sessionStorage.getItem("user")+"&name="+tag+"&type=hashtag", {
            method: "GET",
            headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
          }).then(res => res.json()
          ).then(
              result => {
                  if(!(this.hasTag(result, tag)) || result[1] === 0){
                    fetch(process.env.REACT_APP_API_PATH+"/post-tags", {
                        method: "POST",
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': 'Bearer '+sessionStorage.getItem("token")
                        },
                        body: JSON.stringify({
                            postID: 4,
                            userID: sessionStorage.getItem("user"),
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
              }
          )
          this.getTags()
    }

    myChangeHandler = (event) =>{
        this.setState({tempTag: event.target.value})
    }


    addTagsButton(){
        if(this.state.addClicked === false){
            return(
                <form onSubmit={this.addTag}>
                    <input type="text" placeholder="hashtag" onChange={this.myChangeHandler} onSubmit={this.addTag}></input>
                    <button className="addTag">add tag</button>
                </form>
            )
        }
        if(this.state.addClicked === true){
            return(
                <button className="addTag" onClick={event =>this.changeClick(event.target.value)}>add tag</button>
            )
        }
    }

    render() {
        const tagList = this.state.list;
        var elementList = [];
        for (var i = 0; i<tagList.length;i++){
            var link = "/post-tag/" + tagList[i]
            elementList.push(<a href={link} key={i}>#{tagList[i]} </a>)
        }
        return(
            <div className="tagBlock"> 
                <p className="tag-header">Tags</p>
                <div className="tags">
                    {elementList}
                    {this.addTagsButton()}
                </div>
            </div>
        );
        


    }
}
