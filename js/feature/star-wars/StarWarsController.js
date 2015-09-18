'use strict';

import React from 'react';

import Controller from '../../lib/navigation/Controller';
import render from '../../lib/render/Render';
import StarshipListPage from './StarshipListPage.jsx';
import StarshipShowPage from './StarshipShowPage.jsx';
import data from '../../lib/data/Store';

export default new Controller({
	name: 'StarWars',

	routes: {
		INDEX: '',
		SHOW: 'ship/:id'
	},

	INDEX: () => {
		render({
			selector: '.app',
			template: React.createElement(StarshipListPage, { data: data })
		});
	},

	SHOW: (id) => {
		console.log(id);
		render({
			selector: '.app',
			template: React.createElement(StarshipShowPage, { data: data, id: id })
		});	
	} 
});
