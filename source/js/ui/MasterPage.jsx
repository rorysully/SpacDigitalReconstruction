import React, { Component } from 'react'
import { Switch, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Model from './modelViewer';
import AboutMaster from './about';
import PhotoViewer, { TwoPhoto } from './photoViewer';
import LanguageActions, { i18nlabels } from './LanguageActions.js';
import SideBarMenu from './SideBarMenu.jsx';
import PopupModel from './modelViewer/PopupModel.jsx';
import PhotoMasterPage from './photoViewer/PhotoMasterPage.jsx';

class MasterPage extends Component {

    constructor(props) {
        super(props);
    }

    onClickLink(page) {
        console.log("Link to : " + page + " clicked");
        // window.location.hash = page;
        this.props.history.push(page);
    }

    render() {
        console.log("Master page rendering");
        let isAboutPage = false;
        let isPhoto = false;
        if (location.hash.toString().indexOf("content/about") > -1) {
            isAboutPage = true;
        }
        else if (location.hash.toString().indexOf("content/photo") > -1 || location.hash.toString().indexOf("/two_photo") > -1) {
            isPhoto = true;
        }

        return (
            <div>
                {
                    !isPhoto ?
                        <div className="homeBar" onClick={() => this.onClickLink('/content/model')}>
                            <div className="logo" />
                        </div>
                        :
                        null
                }
                {
                    !isPhoto ?
                        <div className="buttonBar">
                            {
                                isAboutPage ?
                                    <a onClick={() => this.onClickLink('/content/model')}>{i18nlabels(this.props.labels, 'master_page_explore', 'Eksploro')}</a>
                                    :
                                    <a onClick={() => this.onClickLink('/content/about')}>{i18nlabels(this.props.labels, 'master_page_about', 'About')}</a>
                            }
                            <button id="albanianButton" onClick={() => this.props.changeLang('al')}>{i18nlabels(this.props.labels, 'master_page_language_al', 'Albanian')}</button>
                            <button id="englishButton" onClick={() => this.props.changeLang('en')}>{i18nlabels(this.props.labels, 'master_page_language_en', 'English')}</button>
                        </div>
                        :
                        null
                }

                {
                    !isAboutPage && !isPhoto && this.props.showModalOpen && this.props.showModal &&
                    < PopupModel />
                }
                {
                    !isAboutPage && !isPhoto &&
                    <SideBarMenu history={this.props.history} />
                }

                <div className="myContainer">
                    <Switch>
                        <Redirect exact="true" from="/" to="/content/model" />
                        <Route path="/content/model" component={Model} />

                        <Route path="/content/about" component={AboutMaster} />
                        <Route path="/content/photo" component={PhotoMasterPage} />
                        <Route path="/content/two_photo" component={TwoPhoto} />
                    </Switch>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.lang.language,
        labels: state.lang.labels,
        showModal: state.app.showModal,
        showModalOpen: state.app.showModalOpen,
    }
};

function mapDispatchToProps(dispatch) {
    return {
        changeLang: function (lang) {
            return dispatch(LanguageActions.changeLang(lang));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterPage);