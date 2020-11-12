import React, { Component } from 'react'

export default class PhotoComponent extends Component {
    componentDidMount() {
        document.getElementById("text" + this.props.id).innerHTML = this.props.description;
    }

    componentDidUpdate() {
        document.getElementById("text" + this.props.id).innerHTML = this.props.description;
    }

    onClickDiv() {
        this.props.onClick();
    }

    render() {
        return (
            <div className={"aboutPhotoContainer " + this.props.className} onClick={(event) => this.onClickDiv()}>
                <img src={this.props.img_src} />
                <div className="text">
                    <h1 className="title-font-family">{this.props.title}</h1>
                    <div id={"text" + this.props.id} />
                </div>
            </div>
        )
    }
}
