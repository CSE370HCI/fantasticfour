import React from "react";
import "../App.css";

//The post form component holds both a form for posting, and also the list of current posts in your feed
export default class Followers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userid: props.userid,
            connections: []
        };
    }

    componentDidMount() {
        this.loadFollowers();

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

    loadFollowers() {

        fetch(process.env.REACT_APP_API_PATH+"/connections?connectedUserID="+sessionStorage.getItem("user"), {
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

    render() {
        const {error, isLoaded, connections} = this.state;
        if (error) {
            return <div> Error: {error.message} </div>;
        } else if (!isLoaded) {
            return <div> Loading... </div>;
        } else {
            return (
                <ul>
                    {this.state.connections.map(connection => (
                        <div key={connection.id} className="follower-list">
                            <img src={connection["connectedUser"]["photo"]} alt="profile picture"/>
                            &nbsp;&nbsp;&nbsp;{connection.connectedUser.username}
                        </div>
                    ))}
                </ul>
            );
        }
    }
}
