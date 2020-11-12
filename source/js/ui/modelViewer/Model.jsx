import React, { Component } from 'react';
import { connect } from 'react-redux';

import ModelViewer from './ModelViewer';
import SideBarMenu from '../SideBarMenu.jsx';
import ModelActions from './ModelActions';

class Model extends Component {
    constructor(props) {
        super(props);
        this.onDocumentClick = this.onDocumentClick.bind(this);
        let modelView = new ModelViewer(
            this.onDocumentClick,
            this.onLoadModel.bind(this)
        );

        this.animate = this.animate.bind(this);

        this.state = {
            modelView: modelView,
        }
    }

    onLoadModel() {
        this.props.onModelLoad();
    }

    onDocumentClick(element, event) {
        console.warn("Entered in onDocument click");
        switch (element.target.page_type) {
            case 'photo_360':
                let urlphoto = '/content/photo/index/' + element.target.id;
                this.props.history.push(urlfrephoto);
                break
            case 'two_photo':
                let urltwo = '/content/two_photo/' + element.target.id;
                this.props.history.push(urltwo);
                break
        }
    }

    componentDidMount() {
        console.log("Model mounting");
        this.state.modelView.init();
        this.state.modelView.loadModels();
        this.animate();
    }

    componentWillUnmount() {
        this.animate = null;
        this.state.modelView.destroy();
        this.props.onModelUnmount();
    }

    animate() {
        if (this.animate) {
            requestAnimationFrame(this.animate);
            this.state.modelView.renderMod();
        }
    }

    render() {
        console.log("Model rendering");
        let displayModel = 'none';
        if (this.props.showModel) {
            displayModel = 'block';
        }
        return (
            <div id="model" style={{ display: displayModel }}>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        showModel: state.app.showModel,

    }
};

function mapDispatchToProps(dispatch) {
    return {
        onModelLoad: function () {
            dispatch(ModelActions.onModelLoad());
        },
        onModelUnmount: function () {
            dispatch(ModelActions.onModelUnmount());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Model);