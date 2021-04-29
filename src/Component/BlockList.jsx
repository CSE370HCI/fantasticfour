import React from "react";
import "../App.css";
import Autocomplete from "./Autocomplete.jsx";

export default class Following extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            blockedUsers: [],
            blockedID: ""
        };
        this.fieldChangeHandler.bind(this);
    }

    componentDidMount() {
        //this.loadBlockedUsers();
        this.loadUsers();
    }

    // load and filter users
    loadUsers() {
        fetch(process.env.REACT_APP_API_PATH+"/users/", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(result => {
            let users = result[0];
            let usernames = [];

            users.forEach((user) => {
                if (user.username) {
                    usernames.push(user)
                }
            })

            this.setState({
                userList: usernames
            })
        })
    }

    loadBlockedUsers() {

    }


    fieldChangeHandler(field, e) {
        console.log("field change");
        this.setState({
            [field]: e.target.value
        });
    }

    selectAutocomplete(blockedID) {
        this.setState({
            blockedID: blockedID
        })
        console.log("Blocking:  ", blockedID)
    }

    submitHandler = event => {
        //keep the form from actually submitting
        event.preventDefault();
        if (this.state.blockedID === "") {
            alert("You did not make a selection");
            return;
        }
        console.log(this.state.blockedID);
        //make the api call to the user controller
        
    };


    render() {
        return (
            <div className="follower-row">
                <div className="follower-column left">
                    <ul>
                        {this.state.blockedUsers.map(user => (
                            <div key={user.id} className="follower-list">
                                <img src={user["connectedUser"]["photo"]} alt="profile picture"/>
                                &nbsp;&nbsp;{user.connectedUser.username}&nbsp;&nbsp;
                                <input type="button" className="unfollow-button" onClick={() => {this.unblockUser(user.id)}} value="Unblock"/>
                            </div>
                        ))}
                    </ul>
                </div>
                <div className="follower-column right">
                    <form onSubmit={this.submitHandler} className="profileform">
                        <label>
                            Block a User
                            <br />
                            <div className="autocomplete">
                                <Autocomplete suggestions={this.state.userList} selectAutocomplete={e => this.selectAutocomplete(e)} />
                            </div>
                        </label>
                        <br/>
                        <input className="follow-button" type="submit" value="Block" />
                    </form>
                </div>
            </div>

        );
    }
}
