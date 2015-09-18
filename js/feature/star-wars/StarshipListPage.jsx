'use strict'

import React from 'react';
import DataDrivenComponent from '../../lib/data/DataDrivenComponent';
import ThemeManager from '../../lib/material/ThemeManager';
import { TextField } from 'material-ui';

import { sortBy } from 'lodash';

export default class StarshipListPage extends DataDrivenComponent {

	bindValue (path) {
		return {
			"defaultValue": this.getData(path),
			"data-bind": path
		};
	}

	getChildContext () {
		return { muiTheme: ThemeManager.getCurrentTheme() };
	}

	render () {
		var starships = this.getData('starships')
		var filter_text = this.getData('filter_text') || "";
		var sort = this.getData('sort') || "name";

		if (starships) {
			var rows = sortBy(starships, (ship) => {
					return sort === "cost_in_credits" ? +ship[sort] : ship[sort];
				})
				.filter( ship => {
					return JSON.stringify(ship).indexOf(filter_text) !== -1;
				})
				.map( ship => {
				return <tr key={ship.url}>
					<td>{ship.name}</td>
					<td>{ship.cost_in_credits}</td>
				</tr>
			})	
		} else {
			var rows = <tr>
				<td><img src="http://www.arabianbusiness.com/skins/ab.main/gfx/loading_spinner.gif"/></td>
				<td>Loading...</td>
			</tr>
		}
		return <div>
			<TextField 
				floatingLabelText="filter"
				{ ...this.bindValue('filter_text') } />
			<table>
				<thead>
					<tr>
						<th data-sort="name">Name</th>
						<th data-sort="cost_in_credits">Cost (in Credits)</th>
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</table>
		</div>

	}
}

StarshipListPage.childContextTypes = {
	muiTheme: React.PropTypes.object
};
