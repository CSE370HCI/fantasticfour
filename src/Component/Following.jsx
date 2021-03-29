import React from "react";
import "../App.css";
import Autocomplete from "./Autocomplete.jsx";

export default class Following extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            friendname: "",
            friendid: "",
            responseMessage: "",
            users: [],
            connections: [],
            following: [],
            canIAdd: false
        };
        this.fieldChangeHandler.bind(this);
    }

    loadProfilePictures() {
        let tempIDList = []
        for (let i = 0; i < this.state.connections.length; i++) {
            let user = this.state.connections
            fetch(process.env.REACT_APP_API_PATH+"/user-artifacts?ownerID=" + user[i]["connectedUser"]["id"] + "&category=profile_picture", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+sessionStorage.getItem("token")
                }
            })
                .then(res => res.json())
                .then(
                    result => {
                        tempIDList.push(user[i]["connectedUser"]["id"])
                        user[i]["connectedUser"]["photo"]  = result[0][0]["url"]
                        this.setState({
                            connections: user,
                            following: tempIDList
                        });
                    }
                )
        }
    }

    loadFollowers() {
        fetch(process.env.REACT_APP_API_PATH+"/connections?userID="+sessionStorage.getItem("user"), {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(
                result => {
                    if (result) {
                        this.setState({
                            isLoaded: true,
                            connections: result[0]
                        });
                        this.loadProfilePictures();
                    }
                },
                error => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    fieldChangeHandler(field, e) {
        console.log("field change");
        this.setState({
            [field]: e.target.value
        });
    }

    selectAutocomplete(friendID) {
        this.setState({
            friendid:friendID
        })
        console.log("Set Friend ID to "+friendID)
    }

    checkInput = () => {
        if (this.state.friendid === "") {
            alert("You did not make a selection");
            return;
        }
        else if (this.state.friendid === sessionStorage.getItem("user")) {
            alert("You cannot follow yourself");
            return;
        }
        fetch(process.env.REACT_APP_API_PATH+"/connections?userID=" + sessionStorage.getItem("user") + "&connectedUserID=" + this.state.friendid, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(
                result => {
                    if (result[1] > 0) {
                        alert("You are already following this person");
                        return;
                    } else{
                        this.setState({
                            canIAdd: true,
                        });
                    }

                },
            );
    };

    componentDidMount() {
        this.loadFollowers();
        //make the api call to the user API to get the user with all of their attached preferences
        fetch(process.env.REACT_APP_API_PATH+"/users/", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }

        })
            .then(res => res.json())
            .then(
                result => {
                    if (result) {
                        let names = [];

                        result[0].forEach(element => {if (element.username){names.push(element)}});

                        this.setState({
                            users: names,
                            responseMessage: result.Status
                        });
                        console.log(names);
                    }
                },
                error => {
                    alert("error!");
                }
            );
    }

    clearForm() {
        this.state.friendid = ""
        this.state.friendname = ""
    }

    submitHandler = event => {
        //keep the form from actually submitting
        event.preventDefault();
        this.checkInput()

        console.log("friend is ");
        console.log(this.state.friendid);


        if (this.state.canIAdd){
            //make the api call to the user controller
            fetch(process.env.REACT_APP_API_PATH+"/connections", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                    connectedUserID: this.state.friendid,
                    userID: sessionStorage.getItem("user"),
                    type:"friend",
                    status:"active"
                })
            })
                .then(res => res.json())
                .then(
                    result => {
                        this.setState({
                            responseMessage: result.Status,
                            canIadd: false
                        });
                        this.loadFollowers();
                        this.clearForm()
                        // window.location.href = "following";
                    }
                );
        }
    };


    render() {
        console.log(this.state.canIAdd)
        const {error, isLoaded, connections} = this.state;
        if (error) {
            return <div> Error: {error.message} </div>;
        } else if (!isLoaded) {
            return <div> Loading... </div>;
        } else {
            return (
                <div className="row">
                    <div className="follower-column left">
                        <ul>
                            {this.state.connections.map(connection => (
                                <div key={connection.id} className="follower-list">
                                    <img src={connection["connectedUser"]["photo"]} alt="profile picture"/>
                                    &nbsp;&nbsp;&nbsp;{connection.connectedUser.username}
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div className="follower-column right">
                        <form onSubmit={this.submitHandler} className="profileform">
                            <label>
                                Follow a User
                                <br />
                                <div className="autocomplete">
                                    <Autocomplete suggestions={this.state.users} selectAutocomplete={e => this.selectAutocomplete(e)} />
                                </div>
                            </label>
                            <input type="submit" value="Follow" />
                            {this.state.responseMessage}
                        </form>
                    </div>
                </div>

            );
        }

    }
}
