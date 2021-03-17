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
        this.myChangeHandler.bind(this)
        this.tagblock = React.createRef()
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

    addTag = (event) => {

        var tag = this.state.tempTag;
        console.log("Attempting to fetch tag: "+ tag)
        fetch(process.env.REACT_APP_API_PATH+"/post-tags?userID="+sessionStorage.getItem("user")+"?name="+tag+"?type=hashtag", {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
          }).then(res => res.json()
          ).then(
              result => {
                  console.log("RETURNED OBJECT: "+result)
                  if(result.tags.includes(tag)){
                      
                  }else{
                    fetch(process.env.REACT_APP_API_PATH+"/post-tags", {
                        method: "POST",
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          userID: sessionStorage.getItem("user"),
                          name: tag,
                          type: "hashtag"
                        })
                        
                      })
                  }
              }
          )
    }

    myChangeHandler = (event) =>{
        this.setState({tempTag: event.target.value})
    }


    addTagsButton(){
        if(this.state.addClicked === false){
            return(
                <form onSubmit={this.addTag}>
                    Adding {this.state.tempTag} 
                    <br />
                    <input type="text" placeholder="hashtag" onChange={this.myChangeHandler}></input>
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
        var tagList = [];
        for (const [index, value] of this.state.list){
            tagList.push(<a href="" key={index}>#{value}</a>)
        }
        return(
            <div className="tagBlock"> 
                <p className="tag-header">Tags</p>
                <div className="tags">
                    {tagList}
                    {this.addTagsButton()}
                </div>
            </div>
        );
        


    }



}