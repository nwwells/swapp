'use strict'

import React from 'react';
import DataDrivenComponent from '../../lib/data/DataDrivenComponent';
import ThemeManager from '../../lib/material/ThemeManager';

export default class StarshipListPage extends DataDrivenComponent {

	getChildContext () {
		return { muiTheme: ThemeManager.getCurrentTheme() };
	}

	render () {
		var starships = this.getData('starships')
		var starshipsStr = JSON.stringify(starships, 0, 2);
		if (starships) {
			var rows = starships.map( ship => {
				return <tr key={ship.url}>
					<td>{ship.name}</td>
					<td>{ship.cost_in_credits} Credits</td>
				</tr>
			})	
		} else {
			var rows = <tr>
				<td><img src="http://www.arabianbusiness.com/skins/ab.main/gfx/loading_spinner.gif"/></td>
				<td>Loading...</td>
			</tr>
		}
		return <table>{rows}</table>

	}
}

StarshipListPage.childContextTypes = {
	muiTheme: React.PropTypes.object
};
