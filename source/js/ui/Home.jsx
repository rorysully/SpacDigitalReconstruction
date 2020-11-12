import React, { Component } from 'react';
import { connect } from 'react-redux';

import LanguageActions, { i18nlabels } from './LanguageActions.js';

class Home extends Component {

    onClickButton(page) {
        this.props.history.push(page);
    }

    render() {
        console.log('rendering HOME PAGE');
        return (
            <div className="home-page">
                <a className="logo" href="http://chwb.org/albania/" />

                <div className="home-buttonBar">
                    {
                        this.props.language === 'en' ?
                            <button onClick={() => this.props.changeLang('al')}>{i18nlabels(this.props.labels, 'master_page_language_al', 'Albanian')}</button>
                            :
                            <button onClick={() => this.props.changeLang('en')}>{i18nlabels(this.props.labels, 'master_page_language_en', 'English')}</button>
                    }
                </div>

                <div className="content">
                    <div className="title title-font-family">
                        <div className="content-end">
                            <label>{i18nlabels(this.props.labels, 'home_page_title', 'Burgu i Spacit')}</label>
                        </div>
                    </div>
                    <div className='subtitle'>
                        <div className="content-end">
                            <label>{i18nlabels(this.props.labels, 'hame_page_subtitle', 'Rindërtim Digjital (Prototip)')}</label>
                        </div>
                    </div>
                    <div className="buttons">
                        <div className="content-end">
                            <button onClick={() => this.onClickButton('/content/model')}>
                                {i18nlabels(this.props.labels, 'home_page_button_1', 'Eksploro')}
                            </button>
                        </div>
                    </div>
                    <div className="buttons">
                        <div className="content-end">
                            <button onClick={() => this.onClickButton('/content/about')}>
                                {i18nlabels(this.props.labels, 'home_page_button_2', 'Mbi Projektin')}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        labels: state.lang.labels,
        language: state.lang.language,
    }
};

function mapDispatchToProps(dispatch) {
    return {
        changeLang: function (lang) {
            return dispatch(LanguageActions.changeLang(lang));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
