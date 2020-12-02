import React, { Component } from 'react';
import ReactPannellum from 'react-pannellum';
import { connect } from 'react-redux';
import update from 'immutability-helper';

import roomsjson from '../../../stubs/rooms.json';

import LanguageActions, { i18nlabels } from '../LanguageActions';

class PhotoViewer extends Component {
  constructor(props) {
    super(props);

    this.onClickHotSpot = this.onClickHotSpot.bind(this);
    this.getRoomTarget = this.getRoomTarget.bind(this);

    this.state = {
      roomTarget: {},
      showStoryContainer: true,
    }
  }

  getRoomTarget() {
    let roomNumber = 0;
    if (window.location.hash.indexOf("content/photo/index/") >= 0) {
      roomNumber = window.location.hash.split("content/photo/index/")[1];
    } else if (window.location.hash.indexOf("content/photo/hotspot/") >= 0) {
      roomNumber = window.location.hash.split("content/photo/hotspot/")[1];
    }
    console.log("Room Number: " + roomNumber);

    let rooms = roomsjson.rooms;
    let roomTarget = null;
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id == roomNumber) {
        roomTarget = rooms[i];
      }
    }
    if (this.state.roomTarget.id !== roomTarget.id) {
      let newState = update(this.state, {
        roomTarget: { $set: roomTarget }
      })
      this.setState(newState);
    }
  }

  onClickExit() {
    console.log("onClickExit ");
    this.props.history.push("/content/model");
  }

  onClickHotSpot(event, page) {
    console.log('onClickHotspot ');
    event.preventDefault();
    console.log(page);
    this.props.history.push(page);
  }

  componentDidMount() {
    this.getRoomTarget();
    let story = document.getElementById("photoStoryContainerText");
    let labelCode = "room_" + this.state.roomTarget.id + "_story_content";
    if (story) {
      story.innerHTML = i18nlabels(this.props.labels, labelCode, this.state.roomTarget.story_content);
    }
  }

  componentDidUpdate() {
    this.getRoomTarget();
    let story = document.getElementById("photoStoryContainerText");
    let labelCode = "room_" + this.state.roomTarget.id + "_story_content";
    if (story) {
      story.innerHTML = i18nlabels(this.props.labels, labelCode, this.state.roomTarget.story_content);
    }
  }

  onClickStory() {
    this.setState({
      showStoryContainer: !this.state.showStoryContainer
    })
  }

  render() {
    console.log("Rendering PhotoViewer!!!");
    let config = {
      autoRotate: -2,
      autoLoad: true,
      compass: true,
    }
    let style = {
      width: "100%",
      height: "100%",
      position: "absolute"
    }

    if (this.state.roomTarget.hotspots && this.state.roomTarget.hotspots.length > 0) {
      let hotSpots = this.state.roomTarget.hotspots;
      config.hotSpots = [];
      for (let i = 0; i < hotSpots.length; i++) {
        let newHotSpot = {};
        newHotSpot.pitch = hotSpots[i].pitch;
        newHotSpot.yaw = hotSpots[i].yaw;
        newHotSpot.type = hotSpots[i].type;
        newHotSpot.sceneId = hotSpots[i].sceneId;
        newHotSpot.text = i18nlabels(this.props.labels, hotSpots[i].text, hotSpots[i].text)
        newHotSpot.URL = hotSpots[i].URL;
        newHotSpot.clickHandlerFunc = (event) => this.onClickHotSpot(event, hotSpots[i].URL);
        config.hotSpots.push(newHotSpot);
      }
    }

    return (
      <div>
        <button
          className="photoExitButton"
          onClick={() => this.onClickExit()}
        >
          <span>
            &#127303;
        </span>
        </button>

        <div className="photoStory">
          <div className="photoStoryTitle">
            {i18nlabels(this.props.labels, "room_" + this.state.roomTarget.id + "_page_title", this.state.roomTarget.page_title)}
          </div>
          {
            this.state.showStoryContainer &&
            <div className="photoStoryContainer">
              <div className="photoStoryContainerButtons">
                <button onClick={() => this.onClickStory()}>
                  {/*<i className="far fa-window-minimize"></i>*/}
                </button>
              </div>
              <div id="photoStoryContainerText" />
            </div>
          }
        </div>

        {
          this.state.roomTarget.id &&
          <ReactPannellum
            id={toString(this.state.roomTarget.id)}
            sceneId={"photoViewer_" + this.state.roomTarget.id}
            imageSource={this.state.roomTarget.image_1}
            config={config}
            style={style}
          />
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    labels: state.lang.labels,
  }
};

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoViewer);