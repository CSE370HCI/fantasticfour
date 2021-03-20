import React from "react";
import "../App.css";
import {
   Link
} from 'react-router-dom';

export default class StyleGuide extends React.Component {

  render() {
    return (
      <div id="styleguide" className="=stylepage">
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
          </content>
          <br/>
          <content>
            Confirmation Button (Delete)
          </content>
        </heading>
        <br/>
        <br/>
        <heading>
          Create Content
          <br/>
          <content>
            Create Post Button
            <div className="button-create-post"></div>
          </content>
          <br/>
          <content>
            Post Content Buttons
            <div className="post-buttons">
              {/* cancel button */}
              <div className="button-cancel-post">Cancel</div>
              {/* post button */}
              <div className="button-submit-post">Post</div>
            </div>
          </content>
        </heading>
        <br/>
        <br/>
        <heading>
          Upvote Post Icons (Desktop)
          <br/>
          <content>
            Upvote / Downvote (Not Selected)
          </content>
          <br/>
          <content>
            Upvote (Selected)
          </content>
          <br/>
          <content>
            Downvote (Selected)
          </content>
        </heading>
        <br/>
        <br/>
        <heading>
          Upvote Post Icons (Mobile)
          <br/>
          <content>
            Upvote / Downvote (Not Selected)
          </content>
          <br/>
          <content>
            Upvote (Selected)
          </content>
          <br/>
          <content>
            Downvote (Selected)
          </content>
        </heading>
      </div>
    );
  }
}
