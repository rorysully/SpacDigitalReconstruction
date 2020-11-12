import React, { Component } from 'react'

export default class BaseComponent extends Component {
    componentDidMount() {
        document.getElementById("baseText").innerHTML = this.props.doc;
    }
    componentDidUpdate() {
        document.getElementById("baseText").innerHTML = this.props.doc;
    }
    render() {
        return (
            <div className="baseContent">
                {this.props.title && <h1>{this.props.title}</h1>}
                <div id="baseText" />
            </div>
        )
    }
}
