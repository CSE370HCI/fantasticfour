import React from "react";
import "../App.css";
import "./styles/Following.css";
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
            is_invalid_selection: false

        };
        this.fieldChangeHandler.bind(this);
    }

    componentDidMount() {
        this.loadUserList();
    }

    loadUserList = () => {
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
                        this.loadFollowers();
                    }
                }
            );
    }

    loadFollowers() {
        let tempIDList = []
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
                        for (let i = 0; i < result[1]; i++) {
                            tempIDList.push(result[0][i]["connectedUser"]["id"])
                        }
                        this.setState({
                            isLoaded: true,
                            connections: result[0],
                            following: tempIDList
                        });
                        this.loadProfilePictures();
                        this.filterUsers();
                    }
                }
            );

    }

    loadProfilePictures() {
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
                        user[i]["connectedUser"]["photo"]  = result[0][0]["url"]
                        this.setState({
                            connections: user
                        });

                    }
                )
        }
    }

    filterUsers() {
        let tempUsers = this.state.users
        for (let i = tempUsers.length - 1; i != -1; i--) {
            if (tempUsers[i]["id"] == sessionStorage.getItem("user")
                || this.state.following.includes(tempUsers[i]["id"])) {
                tempUsers.splice(i, 1);
            }
        }
        this.setState({
            users: tempUsers
        });
    }

    fieldChangeHandler(field, e) {
        console.log("field change");
        this.setState({
            [field]: e.target.value,
            is_invalid_selection: false,
        });
    }

    selectAutocomplete(friendID) {
        this.setState({
            friendid:friendID,
            is_invalid_selection: false,
        })
    }

    clearForm() {
        this.state.friendid = ""
        this.state.friendname = ""
    }

    unfollowUser(connectionID) {
        fetch(process.env.REACT_APP_API_PATH+"/connections/" + connectionID, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
        })
        this.loadUserList()
    }

    submitHandler = event => {
        this.setState({
            is_invalid_selection: false
        });
        //keep the form from actually submitting
        event.preventDefault();
        if (this.state.friendid === "") {
            this.setState({
                is_invalid_selection: true
            });
            return;
        }
        console.log("friend is ");
        console.log(this.state.friendid);
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
                        responseMessage: result.Status
                    });
                    // this.loadFollowers();
                    // this.clearForm()
                    window.location.href = "following";
                }
            );
    };


    render() {
        const {error, isLoaded} = this.state;
        if (error) {
            return <div> Error: {error.message} </div>;
        } else if (!isLoaded) {
            return <div> Loading... </div>;
        } else {
            return (
                <div className="follower-row">
                    <div className="follower-column left">
                        <ul>
                            {this.state.connections.map(connection => (
                                <div key={connection.id} className="follower-list">
                                    <img src={connection["connectedUser"]["photo"]} alt={connection.connectedUser.username}/>
                                    {connection.connectedUser.username}
                                    <input type="button" className="desktop-delete" onClick={() => {this.unfollowUser(connection.id)}} value="Unfollow"/>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div className="follower-column right">
                        <form onSubmit={this.submitHandler} className="profileform">
                            <label>
                                Follow a User
                                {
                                    this.state.is_invalid_selection ? (
                                        <p className="error-message">⚠ You did not select a user!</p>
                                    ) : ""
                                }
                                <br />
                                <div className="autocomplete">
                                    <Autocomplete suggestions={this.state.users} selectAutocomplete={e => this.selectAutocomplete(e)} />
                                </div>
                            </label>
                            <br/>
                            <input className="desktop-confirm" type="submit" value="Follow" />
                            {this.state.responseMessage}
                        </form>
                    </div>
                </div>

            );
        }
    }
}
