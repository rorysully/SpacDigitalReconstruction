import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router'
import PhotoViewer from './PhotoViewer.jsx'

export default class PhotoMasterPage extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/content/photo/index" component={PhotoViewer} />
                    <Route path="/content/photo/hotspot" component={PhotoViewer} />
                </Switch>
            </div>
        )
    }
}
