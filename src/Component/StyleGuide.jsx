import React from "react";
import "../App.css";
import {
   Link
} from 'react-router-dom';

export default class StyleGuide extends React.Component {

  render() {
    return (
      <div id="styleguide" className="styleGuide">
        <heading>
          Branding
          <br/>
          <content>
            Logo
          </content>
          <br/>
          <content>
            Icon
          </content>
        </heading>
        <br/>
        <br/>
        <heading>
          Color Palette
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
