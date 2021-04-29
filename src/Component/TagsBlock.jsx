import React from "react";

import "../App.css";
import "./styles/TagsBlock.css";
import {Redirect} from 'react-router-dom';

export default class TagsBlock extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          type: "post",
          list: [],
          id: 0,
          addClicked: false,
          tempTag: '',
          tagredirect: false
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
        event.preventDefault();
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
          );
        this.getTags();
        event.target.submit();
    }

    myChangeHandler = (event) =>{
        this.setState({tempTag: event.target.value})
    }


    addTagsButton(){
        if(this.state.addClicked === false){
            return(
                <form onSubmit={this.addTag}>
                    <input type="text" placeholder="hashtag" onChange={this.myChangeHandler} id='field' onSubmit={this.addTag}></input>
                    <button className="addTag" >add tag</button>
                </form>
            )
        }
        if(this.state.addClicked === true){
            return(
                <button className="addTag" onClick={event =>this.changeClick(event.target.value)}>add tag</button>
            )
        }
    }

    filterbyTags(){
        var checkboxes = document.getElementsByName("hashtags"); 
        var query=""
        for(var i = 0; i < checkboxes.length; i++){  
            if(checkboxes[i].checked)  
                query = query.concat(checkboxes[i].value).concat("&")
        } 
        
    }

    setRedirect = () => {
        this.setState({
          redirect: true
        })
      }

    tagRedirect(){
        var checkboxes = document.getElementsByName("hashtag"); 
        var query=""
        for(var i = 0; i < checkboxes.length; i++){  
            console.log("Checked?"+checkboxes[i].checked)
            if(checkboxes[i].checked)  {
                query = query.concat(checkboxes[i].value).concat("&")
            }
        } 
        window.location.href = '/tag/'+query;

      }

    render() {
        const tagList = this.state.list;
        var elementList = [];
        for (var i = 0; i<tagList.length;i++){
            var link = "/tag/" + tagList[i]
            elementList.push(<a href={link} key={i} className="tag"> 
                <label className="tag"><input type="checkbox" name="hashtag" id={tagList[i]} value={tagList[i]} className="checkbox"/> #{tagList[i]} </label>
            </a>)
        }

        return(
            <div > 
                <p className="tag-header">Tags</p>
                <div className="tags">
                <form onSubmit={event => this.tagRedirect}>
                    {elementList}
                </form>
                <button onClick={this.tagRedirect} onSubmit={this.tagRedirect}>search tags</button>
                    {this.addTagsButton()}
                </div>
            </div>
        );
        
    }
}
