'use strict'

import React from 'react';
import DataDrivenComponent from '../../lib/data/DataDrivenComponent';
import ThemeManager from '../../lib/material/ThemeManager';
import { TextField } from 'material-ui';

import { sortBy, includes } from 'lodash';

export default class StarshipListPage extends DataDrivenComponent {

	getChildContext () {
		return { muiTheme: ThemeManager.getCurrentTheme() };
	}

	render () {
		return <div>
			You want to see {this.props.id}!
		</div>

	}
}

StarshipListPage.childContextTypes = {
	muiTheme: React.PropTypes.object
};
