import React, { Component } from 'react';
import { connect } from 'react-redux';
import update from 'immutability-helper';

import aboutInfo from '../../../stubs/about.json';

import PhotoComponent from './PhotoComponent.jsx';
import LanguageActions, { i18nlabels } from '../LanguageActions';

class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spacPrison: aboutInfo.spac_prison,
            methodology: aboutInfo.methodology,
            memorialization: aboutInfo.memorialization,
            credits: aboutInfo.credits,
            opened: "about",
            title: "About",
        }
    }

    componentDidMount() {
        this.setText();
    }

    componentDidUpdate() {
        this.setText();
    }

    setText() {
        document.getElementById("creditsContent").innerHTML = i18nlabels(this.props.labels, 'about_credits_document', 'can not translate');
    }

    onClickSector(page) {
        this.props.history.push(page);
    }

    render() {
        return (
            <div className="aboutContent">
                <div className="myContent" id="myContent">
                    <PhotoComponent
                        id="1"
                        className="first"
                        title={i18nlabels(this.props.labels, 'about_spac_prison_title', "Spac Prison")}
                        img_src={this.state.spacPrison.img_src}
                        description={i18nlabels(this.props.labels, 'about_spac_prison_description', 'spac prison description')}
                        onClick={() => this.onClickSector('/content/about/prison')}
                    />
                    <PhotoComponent
                        id="2"
                        className="second"
                        title={i18nlabels(this.props.labels, 'about_methodology_title', 'Methodology')}
                        img_src={this.state.methodology.img_src}
                        description={i18nlabels(this.props.labels, 'about_methodology_description', 'methodology description')}
                        onClick={() => this.onClickSector('/content/about/methodology')}
                    />
                    <PhotoComponent
                        id="3"
                        className="third"
                        title={i18nlabels(this.props.labels, 'about_memorialization_title', "Memorialization")}
                        img_src={this.state.memorialization.img_src}
                        description={i18nlabels(this.props.labels, 'about_memorialization_description', 'memorialization description')}
                        onClick={() => this.onClickSector('/content/about/memorialization')}
                    />
                </div>

                <hr></hr>
                <div className="credits">
                    <h1>{i18nlabels(this.props.labels, 'about_credits_title', 'Credits')}</h1>
                    <div id="creditsContent" />
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);