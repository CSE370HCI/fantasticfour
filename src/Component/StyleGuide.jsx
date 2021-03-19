import React from "react";
import "../App.css";
import {
   Link
} from 'react-router-dom';

export default class StyleGuide extends React.Component {

  render() {
    return (
      <div id="styleguide" className="styleGuide maincontent">
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
          </content>
          <br/>
          <content>
            Font (Desktop Body)
          </content>
          <br/>
          <content>
            Font (Mobile Header)
          </content>
          <br/>
          <content>
            Font (Mobile Body)
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
          </content>
          <br/>
          <content>
            Post Content Buttons
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
