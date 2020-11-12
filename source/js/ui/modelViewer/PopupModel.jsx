import React, { Component } from 'react';
import { connect } from 'react-redux';

import ModelActions from './ModelActions';

class PopupModel extends Component {
    constructor(props) {
        super(props);

        this.closePopup = this.closePopup.bind(this);

        this.state = {
            show: true,
        }
    }

    closePopup() {
        this.setState({
            show: false
        }, this.props.terminateModal());
    }

    componentDidMount() {

    }

    render() {
        if (!this.state.show) {
            return null;
        }
        return (
            <div className="modal myModal" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <button type="button" className="close" onClick={this.closePopup}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <p>
                                Click and drag to move the camera.
                            <br />
                                Best experienced on a pc/laptop.
                            </p>
                            <p>
                                Kliko dhe mbaj kursorin për të lëvizur kamerën.
                            <br />
                                Përjetimi optimal në PC/Laptop
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
    }
};

function mapDispatchToProps(dispatch) {
    return {
        terminateModal: function () {
            return dispatch(ModelActions.terminateModal());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupModel);