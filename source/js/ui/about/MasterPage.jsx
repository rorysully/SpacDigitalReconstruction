import React, { Component } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import update from 'immutability-helper';

import About from './About.jsx';
import Prison from './Prison.jsx';
import BaseComponent from './BaseComponent.jsx';
import LanguageActions, { i18nlabels } from '../LanguageActions';

import aboutInfo from '../../../stubs/about.json';

class MasterPage extends Component {
    constructor(props) {
        super(props);

        this.onClickButtonMemorialization = this.onClickButtonMemorialization.bind(this);

        this.state = {
            page: null,
            spacPrison: aboutInfo.spac_prison,
            methodology: aboutInfo.methodology,
            memorialization: aboutInfo.memorialization,
        }
    }

    getPageTitle() {
        let location = window.location.hash;
        let page = location.split("/about/")[1];

        let pageTitle = i18nlabels(this.props.labels, 'about_badge_about', "About");
        if (page === "prison") {
            pageTitle = i18nlabels(this.props.labels, 'about_badge_spac_prison', "Spac prison");
        } else if (page === "methodology") {
            pageTitle = i18nlabels(this.props.labels, 'about_badge_methodology', "Methodology");
        } else if (page === "memorialization") {
            pageTitle = i18nlabels(this.props.labels, 'about_badge_memorialization', "Memorialization");
        }

        if (page !== this.state.page) {
            let newState = update(this.state, {
                page: { $set: page },
            });
            this.setState(newState);
        }
        return pageTitle;
    }

    onClickDiv(page) {
        // window.location.hash = page;
        this.props.history.push(page);
    }

    onClickButtonMemorialization() {
        if (this.props.lang === "en") {
            window.open('http://chwb.org/albania/wp-content/uploads/sites/4/2020/04/Spac-Concept-ENG.pdf', '_blank');
        } else if (this.props.lang === "al") {
            window.open('http://chwb.org/albania/wp-content/uploads/sites/4/2020/04/Spac-Concept-ALB.pdf', '_blank');
        }
    }

    render() {

        let showMemorializationButton = false;
        if (location.hash.toString().indexOf("content/about/memorialization") > -1) {
            showMemorializationButton = true;
        }

        return (
            <div className="aboutPage">
                <div className="aboutBackgroundPhoto" >
                    <div className="sectionTitle title-font-family">
                        {this.getPageTitle()}
                    </div>
                </div>
                <div className="rightMenu">
                    <div
                        className={this.state.page === "credits" ? "active" : ""}
                        onClick={(event) => this.onClickDiv("/content/about/credits")}
                    >
                        {i18nlabels(this.props.labels, 'about_menu_credits', 'Credits')}
                    </div>
                    <div
                        className={this.state.page === "prison" ? "active" : ""}
                        onClick={(event) => this.onClickDiv("/content/about/prison")}
                    >
                        {i18nlabels(this.props.labels, 'about_menu_spac_prison', 'Spac Prison')}
                    </div>
                    <div
                        className={this.state.page === "methodology" ? "active" : ""}
                        onClick={(event) => this.onClickDiv("/content/about/methodology")}
                    >
                        {i18nlabels(this.props.labels, 'about_menu_methodology', 'Methodology')}
                    </div>
                    <div
                        className={this.state.page === "memorialization" ? "active" : ""}
                        onClick={(event) => this.onClickDiv("/content/about/memorialization")}
                    >
                        {i18nlabels(this.props.labels, 'about_menu_memorialization', 'Memorialization')}
                    </div>
                </div>
                <div className="masterContent">
                    <Switch>
                        <Redirect exact="true" from="/content/about" to="/content/about/credits" />
                        <Route path="/content/about/credits" component={About} />
                        <Route path="/content/about/prison" component={Prison} />
                        <Route path="/content/about/methodology">
                            <BaseComponent doc={i18nlabels(this.props.labels, 'about_methodology_document', 'document')} />
                        </Route>
                        <Route path="/content/about/memorialization">
                            <BaseComponent doc={i18nlabels(this.props.labels, 'about_memorialization_document', 'document')} />
                        </Route>
                    </Switch>
                    {
                        showMemorializationButton &&
                        <div className="end-page-buttons">
                            <button onClick={this.onClickButtonMemorialization}>
                                {i18nlabels(this.props.labels, 'about_memorialization_button_1', 'Koncepti i memorializimit')}
                            </button>
                        </div>
                    }
                    <div className="footer">
                        <div className="image">
                            <img id="chwb" src="../assets/logo_alb_country_black.png" />
                        </div>
                        <div className="image">
                            <img id="sweeden" src="../assets/Sweden_color.png" />
                        </div>
                        <div className="image">
                            <img id="wpi" src="../assets/WPI_Inst_Prim_FulClr.png" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.lang.language,
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

export default connect(mapStateToProps, mapDispatchToProps)(MasterPage);