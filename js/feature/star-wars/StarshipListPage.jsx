'use strict'

import React from 'react';
import DataDrivenComponent from '../../lib/data/DataDrivenComponent';
import ThemeManager from '../../lib/material/ThemeManager';
import { TextField } from 'material-ui';

import { sortBy, includes } from 'lodash';

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
		var filter_name = this.getData('filter_name') || "";
		var less_than = +this.getData('less_than') || 10000000000000;
		var greater_than = +this.getData('greater_than') || 0;
		var sort = this.getData('sort') || "name";

		if (starships) {
			var rows = sortBy(starships, (ship) => {
				return sort === "cost_in_credits" ? +ship[sort] : ship[sort];
			}).filter( ship => {
				return ship.name.indexOf(filter_name) !== -1;
			}).filter( ship => {
				if (ship.cost_in_credits === "unknown") return true;
				return +ship.cost_in_credits > greater_than && +ship.cost_in_credits < less_than;
			}).map( ship => {
				return <tr key={ship.url}>
					<td>{ship.name}</td>
					<td>{ship.cost_in_credits}</td>
				</tr>
			});
		} else {
			var rows = <tr>
				<td><img src="http://www.arabianbusiness.com/skins/ab.main/gfx/loading_spinner.gif"/></td>
				<td>Loading...</td>
			</tr>
		}
		return <div>

			<TextField 
				floatingLabelText="search by name"
				{ ...this.bindValue('filter_name') } />
			<TextField 
				floatingLabelText="costs greater than"
				{ ...this.bindValue('greater_than') } />
			<TextField 
				floatingLabelText="costs less than"
				{ ...this.bindValue('less_than') } />

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
