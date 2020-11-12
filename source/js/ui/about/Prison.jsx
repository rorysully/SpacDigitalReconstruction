import React, { Component } from 'react';
import { connect } from 'react-redux';

import aboutInfo from '../../../stubs/about.json';

import LanguageActions, { i18nlabels } from '../LanguageActions';

class Prison extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spacPrison: aboutInfo.spac_prison,
        }
    }

    componentDidMount() {
        document.getElementById("prisonPlace").innerHTML = i18nlabels(this.props.labels, 'about_spac_prison_place', 'place');
        document.getElementById("prisonHitory").innerHTML = i18nlabels(this.props.labels, 'about_spac_prison_history', 'history');
        document.getElementById("prisonToday").innerHTML = i18nlabels(this.props.labels, 'about_spac_prison_today', 'today');
    }

    componentDidUpdate() {
        document.getElementById("prisonPlace").innerHTML = i18nlabels(this.props.labels, 'about_spac_prison_place', 'place');
        document.getElementById("prisonHitory").innerHTML = i18nlabels(this.props.labels, 'about_spac_prison_history', 'history');
        document.getElementById("prisonToday").innerHTML = i18nlabels(this.props.labels, 'about_spac_prison_today', 'today');
    }

    render() {
        return (
            <div className="baseContent">
                <h1>{i18nlabels(this.props.labels, 'about_page_prison_title1', 'The site')}</h1>
                <div id="prisonPlace"></div>
                <h1>{i18nlabels(this.props.labels, 'about_page_prison_title2', 'Story')}</h1>
                <div id="prisonHitory"></div>
                <h1>{i18nlabels(this.props.labels, 'about_page_prison_title3', 'Current Status and memorialization efforts')}</h1>
                <div id="prisonToday"></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Prison);