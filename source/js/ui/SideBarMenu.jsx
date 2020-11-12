import React, { Component } from 'react';
import { connect } from 'react-redux';
import update from 'immutability-helper';

import LanguageActions, { i18nlabels } from './LanguageActions';

class SideBarMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu1opened: false,
            menu2opened: false,
            menu3opened: false,
            menu4opened: false,
        }
    }

    onClickItem(item) {
        let newState = update(this.state, {
            [item]: { $set: !this.state[item] }
        });
        this.setState(newState);
    }

    onOpenLink(element) {
        console.warn("Entered in onDocument click");
        switch (element.page_type) {
            case 'photo_360':
                let urlphoto = '/content/photo/index/' + element.id;
                this.props.history.push(urlphoto);
                break
            case 'two_photo':
                let urltwo = '/content/two_photo/' + element.id;
                this.props.history.push(urltwo);
                break
        }
    }

    iconRender(menuopened) {
        return <div className='icon'>
            {
                this.state[menuopened] ?
                    <i className="fas fa-minus"></i>
                    :
                    <i className="fas fa-plus"></i>
            }
        </div>
    }

    onHover(object) {
        let customEvent = new CustomEvent('onHoverMenu', { detail: object });
        customEvent.initEvent('onHoverMenu', true, true);

        let sidebar = document.getElementById('sidebarMenu');
        sidebar.dispatchEvent(customEvent);
    }

    onHoverLeave(object) {
        let customEvent = new CustomEvent('onHoverMenuLeave', { detail: object });
        customEvent.initEvent('onHoverMenuLeave', true, true);

        let sidebar = document.getElementById('sidebarMenu');
        sidebar.dispatchEvent(customEvent);
    }

    render() {
        console.log('SideBar rendering...');
        return (
            <div className="menu-container">
                <div className="menu-title-bar">
                    <div className="menu-title title-font-family">
                        <label>{i18nlabels(this.props.labels, 'menu_container_title', 'Spac Prison')}</label>
                    </div>
                    <div className="menu-subtitle">
                        <label>{i18nlabels(this.props.labels, 'menu_container_subtitle', 'Rindërtim Digjital (Prototip)')}</label>
                    </div>
                </div>
                <div id="sidebarMenu" className="side-bar-menu">
                    <div className='item' onClick={() => this.onClickItem('menu1opened')}>
                        <div className="content">
                            {this.iconRender('menu1opened')}
                            <label>
                                {i18nlabels(this.props.labels, 'sidebar_menu_item_1', 'Mbërritja')}
                            </label>
                        </div>
                    </div>
                    {
                        this.state.menu1opened &&
                        <div>
                            <div className="subitem"
                                onClick={() => this.onOpenLink({ page_type: "photo_360", id: 11 })}
                                onMouseEnter={() => this.onHover({ page_type: "photo_360", id: 11 })}
                                onMouseLeave={() => this.onHoverLeave({ page_type: "photo_360", id: 11 })}>
                                <label>
                                    {i18nlabels(this.props.labels, 'sidebar_menu_item_1_subitem_1', 'përshtypja e parë')}
                                </label>
                            </div>
                            <div className="subitem" onClick={() => this.onOpenLink({ page_type: "photo_360", id: 12 })}
                                onMouseEnter={() => this.onHover({ page_type: "photo_360", id: 11 })}
                                onMouseLeave={() => this.onHoverLeave({ page_type: "photo_360", id: 11 })}>
                                <label>
                                    {i18nlabels(this.props.labels, 'sidebar_menu_item_1_subitem_2', 'Mekanizmi i ridënimeve')}
                                </label>
                            </div>
                        </div>
                    }
                    <div className='item' onClick={() => this.onClickItem('menu2opened')}>
                        <div className="content">
                            {this.iconRender('menu2opened')}
                            <label>
                                {i18nlabels(this.props.labels, 'sidebar_menu_item_2', 'Fusha e volibollit')}
                            </label>
                        </div>
                    </div>
                    {
                        this.state.menu2opened &&
                        <div>
                            <div className="subitem" onClick={() => this.onOpenLink({ page_type: "photo_360", id: 21 })}
                                onMouseEnter={() => this.onHover({ page_type: "photo_360", id: 21 })}
                                onMouseLeave={() => this.onHoverLeave({ page_type: "photo_360", id: 21 })}>
                                <label>
                                    {i18nlabels(this.props.labels, 'sidebar_menu_item_2_subitem_1', 'Fusha e volibollit')}
                                </label>
                            </div>
                            <div className="subitem" onClick={() => this.onOpenLink({ page_type: "photo_360", id: 22 })}
                                onMouseEnter={() => this.onHover({ page_type: "photo_360", id: 21 })}
                                onMouseLeave={() => this.onHoverLeave({ page_type: "photo_360", id: 21 })}>
                                <label>
                                    {i18nlabels(this.props.labels, 'sidebar_menu_item_2_subitem_2', 'Ligji i Natyrës')}
                                </label>
                            </div>
                            <div className="subitem" onClick={() => this.onOpenLink({ page_type: "photo_360", id: 23 })}
                                onMouseEnter={() => this.onHover({ page_type: "photo_360", id: 21 })}
                                onMouseLeave={() => this.onHoverLeave({ page_type: "photo_360", id: 21 })}>
                                <label>
                                    {i18nlabels(this.props.labels, 'sidebar_menu_item_2_subitem_3', 'Dera e vogël e ferrit ')}
                                </label>
                            </div>
                            <div className="subitem" onClick={() => this.onOpenLink({ page_type: "photo_360", id: 24 })}
                                onMouseEnter={() => this.onHover({ page_type: "photo_360", id: 21 })}
                                onMouseLeave={() => this.onHoverLeave({ page_type: "photo_360", id: 21 })}>
                                <label>
                                    {i18nlabels(this.props.labels, 'sidebar_menu_item_2_subitem_4', 'Revolta e 1973')}
                                </label>
                            </div>
                        </div>
                    }
                    <div className='item' onClick={() => this.onClickItem('menu3opened')}>
                        <div className="content">
                            {this.iconRender('menu3opened')}
                            <label>
                                {i18nlabels(this.props.labels, 'sidebar_menu_item_3', 'Numërimi')}
                            </label>
                        </div>
                    </div>
                    {
                        this.state.menu3opened &&
                        <div>
                            <div className="subitem"
                                onClick={() => this.onOpenLink({ page_type: "photo_360", id: 31 })}
                                onMouseEnter={() => this.onHover({ page_type: "photo_360", id: 31 })}
                                onMouseLeave={() => this.onHoverLeave({ page_type: "photo_360", id: 31 })}>
                                <label>
                                    {i18nlabels(this.props.labels, 'sidebar_menu_item_3_subitem_1', 'Numërimi')}
                                </label>
                            </div>
                            <div className="subitem" onClick={() => this.onOpenLink({ page_type: "two_photo", id: 32 })}
                                onMouseEnter={() => this.onHover({ page_type: "two_photo", id: 31 })}
                                onMouseLeave={() => this.onHoverLeave({ page_type: "two_photo", id: 31 })}>
                                <label>
                                    {i18nlabels(this.props.labels, 'sidebar_menu_item_3_subitem_2', 'Parrullat')}
                                </label>
                            </div>
                            <div className="subitem" onClick={() => this.onOpenLink({ page_type: "two_photo", id: 33 })}
                                onMouseEnter={() => this.onHover({ page_type: "two_photo", id: 31 })}
                                onMouseLeave={() => this.onHoverLeave({ page_type: "two_photo", id: 31 })}>
                                <label>
                                    {i18nlabels(this.props.labels, 'sidebar_menu_item_3_subitem_3', 'Nën presion')}
                                </label>
                            </div>
                        </div>
                    }
                    <div className='item' onClick={() => this.onOpenLink({ page_type: "two_photo", id: 41 })}
                        onMouseEnter={() => this.onHover({ page_type: "two_photo", id: 41 })}
                        onMouseLeave={() => this.onHoverLeave({ page_type: "two_photo", id: 41 })}>
                        <div className="content">
                            <label>
                                {i18nlabels(this.props.labels, 'sidebar_menu_item_4', 'Norma')}
                            </label>
                        </div>
                    </div>
                    <div className='item' onClick={() => this.onOpenLink({ page_type: "two_photo", id: 42 })}
                        onMouseEnter={() => this.onHover({ page_type: "two_photo", id: 41 })}
                        onMouseLeave={() => this.onHoverLeave({ page_type: "two_photo", id: 41 })}>
                        <div className="content">
                            <label>
                                {i18nlabels(this.props.labels, 'sidebar_menu_item_4_subitem_2', 'Koncerti brenda ne miniere')}
                            </label>
                        </div>
                    </div>
                    <div className='item'>
                        <div className="content" onClick={() => this.onOpenLink({ page_type: "two_photo", id: 5 })}
                            onMouseEnter={() => this.onHover({ page_type: "two_photo", id: 5 })}
                            onMouseLeave={() => this.onHoverLeave({ page_type: "two_photo", id: 5 })}>
                            <label>
                                {i18nlabels(this.props.labels, 'sidebar_menu_item_5', 'Barrakat')}
                            </label>
                        </div>
                    </div>
                    <div className='item'
                        onClick={() => this.onOpenLink({ page_type: "photo_360", id: 6 })}
                        onMouseEnter={() => this.onHover({ page_type: "photo_360", id: 6 })}
                        onMouseLeave={() => this.onHoverLeave({ page_type: "photo_360", id: 6 })}>
                        <div className="content">
                            <label>
                                {i18nlabels(this.props.labels, 'sidebar_menu_item_6', 'Dhoma e takimit me familjarët')}
                            </label>
                        </div>
                    </div>
                    <div className='item' onClick={() => this.onOpenLink({ page_type: "photo_360", id: 7 })}
                        onMouseEnter={() => this.onHover({ page_type: "photo_360", id: 7 })}
                        onMouseLeave={() => this.onHoverLeave({ page_type: "photo_360", id: 7 })}>
                        <div className="content">
                            <label>
                                {i18nlabels(this.props.labels, 'sidebar_menu_item_7', 'Dhoma e fjetjes e Zenelit')}
                            </label>
                        </div>
                    </div>
                    <div className='item' onClick={() => this.onOpenLink({ page_type: "two_photo", id: 8 })}
                        onMouseEnter={() => this.onHover({ page_type: "photo_360", id: 8 })}
                        onMouseLeave={() => this.onHoverLeave({ page_type: "photo_360", id: 8 })}>
                        <div className="content">
                            <label>
                                {i18nlabels(this.props.labels, 'sidebar_menu_item_8', 'Birucat')}
                            </label>
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
    }
};

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarMenu);