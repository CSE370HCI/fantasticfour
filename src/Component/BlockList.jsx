import React from "react";
import "../App.css";
import Autocomplete from "./Autocomplete.jsx";

export default class Following extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authorID: this.props.userid,
            userList: [],
            blockedUsers: [],
            blockedID: "",
            noSelection: false,
            noBlockedUsers: false
        };
        this.fieldChangeHandler.bind(this);
    }

    componentDidMount() {
        this.loadBlockedUsers();
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

    async loadBlockedUsers() {
        console.log("loading blocked users for user: ", this.state.authorID)

        // check if block list exists, if not, no blocked users.
        const getGroups = await fetch(process.env.REACT_APP_API_PATH+"/groups?ownerID=" + this.state.authorID + "&name=block", {
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

            // load group members into blockedUsers array
            this.loadMembers(blockListID)
        }
        else {
            this.setState({
                noBlockedUsers: true
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

            for (let i = 0; i < groupMembersResults[1]; i++) {
                users[i].user.photo = await this.loadPictureFor(users[i].user.id)
                console.log("Profile photo link: ", users[i].user.photo)
                this.setState({
                    blockedUsers: [...this.state.blockedUsers, users[i].user]
                })
            }
            // users.forEach(user => {
            //     console.log("this user has been blocked: ", user.user)
            //     // get profile picture
            //     user.user.photo = this.loadPictureFor(user.user.id)
            //     console.log("profile photo link: ", user.user.photo)
            //     this.setState({
            //         blockedUsers: [...this.state.blockedUsers, user.user]
            //     })
            // })
        }

        //groupMemmbersResult = await getGroupMembers.json()
    }

    // fetches and returns url for user photo
    async loadPictureFor(id) {
        const getUserArtifacts = await fetch(process.env.REACT_APP_API_PATH+"/user-artifacts?ownerID=" + id + "&category=profile_picture", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
            }
        })

        const userArtifactsResults = await getUserArtifacts.json()

        console.log("profile picture url: ", "https://webdev.cse.buffalo.edu" + userArtifactsResults[0][0].url)
        return "https://webdev.cse.buffalo.edu" + userArtifactsResults[0][0].url
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
            this.setState({
                noSelection: true
            })
            return;
        }
        console.log(this.state.blockedID);

        //make the api call to the user controller
        
    };


    render() {
        return (
            <div className="follower-row">
                <div className="follower-column left">
                    {
                        this.state.noBlockedUsers ?
                        <p>No users blocked!</p>
                        :
                        <ul>
                            {this.state.blockedUsers.map(user => (
                                <div key={user.id} className="follower-list">
                                    <img src={user.photo} alt="profile picture"/>
                                <p>{console.log(user.photo)}</p>
                                    &nbsp;&nbsp;{user.username}&nbsp;&nbsp;
                                    <input type="button" className="unfollow-button" onClick={() => {this.unblockUser(user.id)}} value="Unblock"/>
                                </div>
                            ))}
                        </ul>
                    }
                </div>
                <div className="follower-column right">
                    <form onSubmit={this.submitHandler} className="profileform">
                        <label>
                            Block a User
                            <br />
                            <div className="autocomplete">
                                <Autocomplete suggestions={this.state.userList} selectAutocomplete={e => this.selectAutocomplete(e)} />
                                {
                                    this.state.noSelection &&
                                    (
                                        <p className="error-message">⚠ Oops, no selection was made. Select a user and try again!</p>
                                    )
                                }
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
