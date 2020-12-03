import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImageViewer from "react-simple-image-viewer";

import roomsjson from '../../../stubs/rooms.json';

import LanguageActions, { i18nlabels } from '../LanguageActions';

class TwoPhoto extends Component {
    constructor(props) {
        super(props);
        let roomNumber = window.location.hash.split("content/two_photo/")[1];
        console.log("Room Number: " + roomNumber);

        let rooms = roomsjson.rooms;
        let roomTarget = null;
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].id == roomNumber) {
                roomTarget = rooms[i];
            }
        }

        this.closeImageViewer = this.closeImageViewer.bind(this);

        this.state = {
            roomTarget: roomTarget,
            showStoryContainer: true,
            isViewerOpen: false,
            currentImage: 0,
        }
    }

    onClickBack() {
        console.log("onClickBack");
        this.props.history.goBack();
    }

    onClickExit() {
        console.log("onClickExit ");
        this.props.history.push("/content/model");
    }

    componentDidMount() {
        let story = document.getElementById("multiphotoStoryContainerText");
        let labelCode = "room_" + this.state.roomTarget.id + "_story_content";
        if (story) {
            story.innerHTML = i18nlabels(this.props.labels, labelCode, this.state.roomTarget.story_content);
        }
    }

    componentDidUpdate() {
        let story = document.getElementById("multiphotoStoryContainerText");
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

    closeImageViewer() {
        this.setState({
            isViewerOpen: false,
            currentImage: 0
        });
    };

    onOpenImage(index) {
        this.setState({
            isViewerOpen: true,
            currentImage: index
        });
    }

    render() {

        let imageWidth = 100 / this.state.roomTarget.images.length;
        imageWidth = imageWidth.toString() + "%";

        return (
            <div className="d-flex">
                {
                    this.state.roomTarget.mainURL ?
                        <button
                            className="multiphotoExitButton"
                            onClick={() => this.onClickBack()}
                        >
                            <span>
                                &#11184;
                            </span>
                        </button>
                        :
                        <button
                            className="multiphotoExitButton"
                            onClick={() => this.onClickExit()}
                        >
                            <span>
                                &#127303;
                            </span>
                        </button>
                }

                <div className="multiphotoStory">
                    <div className="multiphotoStoryTitle">
                        {i18nlabels(this.props.labels, "room_" + this.state.roomTarget.id + "_page_title", this.state.roomTarget.page_title)}
                    </div>

                    {
                        this.state.showStoryContainer &&
                        <div className="multiphotoStoryContainer">
                            <div className="multiphotoStoryContainerButtons">
                                <button onClick={() => this.onClickStory()}>
                                    <span>
                                        {/*<i className="far fa-window-minimize"></i>*/}
                                    </span>
                                </button>
                            </div>
                            <div id="multiphotoStoryContainerText" />
                        </div>
                    }
                </div>

                <div className="multiphotoContainer">
                    {
                        this.state.roomTarget.images ?
                            this.state.roomTarget.images.map((image, index) => {
                                let url = 'url(' + image + ')';
                                console.log("index => " + index);
                                return <div key={"multiphoto_" + index}
                                    style={{ backgroundImage: url, width: imageWidth }}
                                    onClick={() => this.onOpenImage(index)}
                                />
                            })
                            :
                            null
                    }
                </div>
                {
                    this.state.isViewerOpen &&
                    <ImageViewer
                        src={this.state.roomTarget.images}
                        currentIndex={this.state.currentImage}
                        onClose={this.closeImageViewer}
                        backgroundStyle={{
                            backgroundColor: "rgba(0,0,0,0.9)"
                        }}
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
        i18n: function (code) {
            return dispatch(LanguageActions.i18n(code));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TwoPhoto);