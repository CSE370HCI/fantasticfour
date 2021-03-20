import React from "react";
import "../App.css";
import {
   Link
} from 'react-router-dom';
import back from "../assets/back.png";
import upvote_enabled from "../assets/upvote-enabled.png";
import downvote_enabled from "../assets/downvote-enabled.png";
import upvote_selected from "../assets/upvote-selected.png";
import downvote_selected from "../assets/downvote-selected.png";
import upvote_disabled from "../assets/upvote-disabled.png";
import downvote_disabled from "../assets/downvote-disabled.png";
import createpost from "../assets/createpost.png";

export default class StyleGuide extends React.Component {

  render() {
    return (
      <div id="styleguide" className="styleGuide stylepage">
        <heading>
          Branding
          <br/>
          <content>
            Logo
            <div className="logo"></div>
          </content>
          <br/>
          <content>
            Icon
            <div className="icon"></div>
          </content>
        </heading>
        <br/>
        <br/>
        <heading>
          Color Palette
          <content>
            <p></p>
            <div className="colorblocks">
              <div className="color-primary block">
                <code>#FFFFFF</code>
                <p>Navigation Bar</p>
                <p>Content Border</p>
              </div>
              <div className="color-secondary block">
                <code>#2D86D8</code>
                <p>Buttons that edit</p>
              </div>
              <div className="color-confirm block">
                <code>#30D82D</code>
                <p>Buttons that say yes</p>
                <p>Upvotes</p>
              </div>
              <div className="color-decline block">
                <code>#FF5959</code>
                <p>Buttons that say no</p>
                <p>Downvotes</p>
              </div>
              <div className="color-main-background block">
                <code>#C4C4C4</code>
                <p>Main background</p>
              </div>
            </div>
          </content>

        </heading>
        <br/>
        <br/>
        <heading>
          Fonts
          <br/>
          <content>
            Font (Desktop Header)
            <div className="font-desktop-header">
              <h1>Roboto Bold • 24px • The quick brown fox jumps over the lazy dog</h1>
            </div>
          </content>
          <br/>
          <content>
            Font (Desktop Body)
            <div className="font-desktop-body">
              <p>Roboto • 18px • The quick brown fox jumps over the lazy dog</p>
            </div>
          </content>
          <br/>
          <content>
            Font (Mobile Header)
            <div className="font-mobile-header">
              <h1>Roboto Bold • 18px • The quick brown fox jumps over the lazy dog</h1>
            </div>
          </content>
          <br/>
          <content>
            Font (Mobile Body)
            <div className="font-mobile-body">
              <p>Roboto • 12px • The quick brown fox jumps over the lazy dog</p>
            </div>
          </content>
        </heading>
        <br/>
        <br/>
        <heading>
          Buttons (Generic)
          <br/>
          <content>
            Confirmation Button (Edit)
            <br/>
            <button class="desktop-confirm"><span>Confirm</span></button>
          </content>
          <br/>
          <content>
            Confirmation Button (Delete)
            <br/>
            <button class="desktop-delete"><span>Delete</span></button>
          </content>
        </heading>
        <br/>
        <br/>
        <heading>
          Create Content
          <br/>
          <content>
            Create Post Button
            <br/>
            <img src={createpost}/>
          </content>
          <br/>
          <content>
            Post Content Buttons
          </content>
        </heading>
        <br/>
        <br/>
        <heading>
          Post Voting Icons
          <br/>
          <content>
            Upvote / Downvote (Not Selected)
            <br/>
            <img src={upvote_enabled}/>
            <img src={downvote_enabled}/>
            <br/>
          </content>
          <br/>
          <content>
            Upvote (Selected)
            <br/>
            <img src={upvote_selected}/>
            <img src={downvote_disabled}/>
            <br/>
          </content>
          <br/>
          <content>
            Downvote (Selected)
            <br/>
            <img src={upvote_disabled}/>
            <img src={downvote_selected}/>
            <br/>
          </content>
        </heading>
        <br/>
        <heading>
          Tags
          <br/>
          <content>
            Desktop
            <br/>
            <button class="desktop-tag"><span>#tag</span></button>
          </content>
          <br/>
          <content>
            Mobile
            <br/>
            <button class="mobile-tag"><span>#tag</span></button>
          </content>
        </heading>
        <br/>
        <heading>
          Navigation Buttons
          <br/>
          <content>
            Back (Desktop)
            <br/>
            <Link className="desktop-back" style={{textDecoration: 'none'}}>&times;</Link>
          </content>
          <br/>
          <content>
            Back (Mobile)
            <br/>
            <Link><img src={back}/></Link>
          </content>
        </heading>
      </div>
    );
  }
}