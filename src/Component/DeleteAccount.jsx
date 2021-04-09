import React from "react";
import "../App.css";
import "./styles/DeleteAccount.css";

//The post form component holds both a form for posting, and also the list of current posts in your feed
export default class DeleteAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            delete_option: "",
            post_message: "",
            button_state_css: "danger-button-blocked",
            button_disabled: true,
        };
        this.postListing = React.createRef();
    }

    submitHandler = (event) => {
        //keep the form from actually submitting via HTML - we want to handle it in react
        event.preventDefault();

        if (this.state.delete_option == "PRESERVE") {
            fetch(
                process.env.REACT_APP_API_PATH +
                "/users/" +
                sessionStorage.getItem("user"),
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                    body: JSON.stringify({
                        status: "DELETED",
                    }),
                }
            )
                .then(
                    (result) => {
                        sessionStorage.removeItem("token", null);
                        sessionStorage.removeItem("user", null);
                        window.location.href = "/login";
                    }
                )
        } else if (this.state.delete_option == "PURGE") {
            fetch(
                process.env.REACT_APP_API_PATH +
                "/user-artifacts?ownerID=" +
                sessionStorage.getItem("user"),
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                }
            )
                .then((res) => res.json())
                .then(
                    //deletes all posts
                    (result) => {
                        for (const artifact of result[0]) {
                            console.log(artifact["id"])
                            fetch(process.env.REACT_APP_API_PATH + "/user-artifacts/" + artifact["id"], {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                                },
                            });
                        }
                        fetch(
                            process.env.REACT_APP_API_PATH +
                            "/users/" +
                            sessionStorage.getItem("user"),
                            {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                                },
                            }
                        );
                    }
                )
                .then (
                    (result) => {
                        sessionStorage.removeItem("token", null);
                        sessionStorage.removeItem("user", null);
                        window.location.href = "/login";
                    }
                )
        }

    };

    redirect = () => {
        window.location.href = "/settings";
    };

    // this method will keep the current post up to date as you type it,
    // so that the submit handler can read the information from the state.
    updateInput = (event) => {
        this.setState({
            delete_option: event.target.value,
        });
        if (event.target.value == "PRESERVE" || event.target.value == "PURGE") {
            this.setState({
                button_disabled: false,
                button_state_css: "danger-button-unblocked",
            });
        } else {
            this.setState({
                button_disabled: true,
                button_state_css: "danger-button-blocked",
            });
        }
    };

    render() {
        return (
            <div>
                <form onSubmit={this.submitHandler}>
                    <label>
                        <br />
                        You have two choices when deleting your account. You can PRESERVE
                        your content on the site. You can also PURGE all information that
                        may be associated with you on the site. Note that once your account
                        is deleted, you will be logged out and will not be able to log back
                        in.
                        <br />
                        <br />
                        <br />
                        Type "PRESERVE" or "PURGE" to confirm your choice
                        <br />
                        <input
                            type="text"
                            onChange={this.updateInput}
                        />
                    </label>
                    <br />
                    <br />

                    <input
                        type="submit"
                        disabled={this.state.button_disabled}
                        className={"desktop-delete " + this.state.button_state_css}
                        value="Confirm"
                    />
                    <input
                        type="button"
                        className="desktop-confirm cancel-button"
                        onClick={this.redirect}
                        value="Cancel"
                    />
                    &nbsp;&nbsp;
                    <br />
                </form>
            </div>
        );
    }
}
