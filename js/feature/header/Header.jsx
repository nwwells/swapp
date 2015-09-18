'use strict'

import React from 'react';
import { AppBar } from 'material-ui';
import ThemeManager from '../../lib/material/ThemeManager';

export default class Header extends React.Component {

	getChildContext () {
		return { muiTheme: ThemeManager.getCurrentTheme() };
	}

	render () {
		return <AppBar title="Hello Header!" showMenuIconButton={false}></AppBar>
	}
}

Header.childContextTypes = {
	muiTheme: React.PropTypes.object
};

