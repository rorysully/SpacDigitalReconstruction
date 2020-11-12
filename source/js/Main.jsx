import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import store from './store';

import MasterPage from './ui/MasterPage.jsx';
import Home from './ui/Home.jsx';

class NotFound extends Component {
    render() {
        let url = this.props.location;
        console.log("PAGE NOT FOUND WITH URL:", url, this.props);
        return (
            <div>
                <div>
                    <h1>Page not found</h1>
                </div>
                <div>
                    <div >
                        <p>The requested URL <b>{'#'}{url}</b> was not found.</p>
                        <p>Please check misspelling and try again.</p>
                    </div>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                </div>
            </div>
        );
    }
}

class MyApplicationReact extends Component {
    constructor(props) {
        super(props);
        console.log('MyApplicationReact: constructor');
    }

    componentWillUnmount() {
        console.log('MyApplicationReact: componentWillUnmount');
    }

    componentDidMount() {
        console.log('MyApplicationReact: componentDidMount');
        window.onhashchange = function (hashChangeEvent) {
            console.log("HASH_CHANGE ON MAIN");
            // window.location.reload();
        };
    }

    render() {
        console.log('MyApplicationReact: render');

        return (
            <Router>
                <Switch>
                    <Redirect exact="true" from="/" to="/home" />
                    <Route path="/content" component={MasterPage} />
                    <Route path="/home" component={Home} />
                </Switch>
            </Router>
        );
    }
}

import { Provider } from 'react-redux';
ReactDOM.render(
    <Provider store={store} >
        <MyApplicationReact />
    </Provider>,
    document.getElementById('react-application')
);