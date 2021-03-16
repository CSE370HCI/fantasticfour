import React from "react";
import Post from "./Post.jsx";

export default class TagsBlock extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          type: "post",
          list: [],
          id: 0
        };
        this.post = React.createRef();
    
    }

    setType(type){
        this.state.type = type
        if(type == "post"){
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
                    this.state.list = result.tags;
                },
                error => {
                    alert("error!");
                }
            );
        }else if(type == "user"){
            fetch(process.env.REACT_APP_API_PATH+"/post-tags?userID="+this.state.id, {
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
                    this.state.list = result.tags;
                },
                error => {
                    alert("error!");
                }
            );
        }
    }

    render() {
        var tagList = [];
        for (const [index, value] of this.state.list){
            tagList.push(<a key={index}>#{value}</a>)
        }
        return(
            <div className="tagBlock"> 
                <p className="tag-header">Tags</p>
                <div className="tags">
                    {tagList}
                </div>
            </div>
        );
        


    }



}