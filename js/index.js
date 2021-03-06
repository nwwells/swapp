'use strict';

import emit from './lib/events/Emit';
import addDomEvents from './lib/events/AddDomEvents';

import request from 'superagent';

import router from './lib/navigation/Router';
import StarWarsController from './feature/star-wars/StarWarsController';

import navigate from './lib/navigation/Navigate';
import render from './lib/render/Render';
import Header from './feature/header/Header.jsx';
import React from 'react';

import store from './lib/data/Store';

import {
	uuid,
	matchesSelector,
	findAncestorMatching,
	isCheckbox,
	failSafe,
	getScrollParent,
	getTotalOffsetTop,
	toPixels
} from './lib/utils/Utils';
import { omit, forOwn, isEmpty } from 'lodash';
import f from './lib/utils/Functional';

window.render = render; // for debugging purposes

////////////////////////////////////////////////////////////////////////////////
//
// System Initialization
//
function init () {
	//extensions
	addDomEvents(emit);

	//start the router -- trigger the default route.
	router.start({
		hashChange:  false,
		pushState:   true
	});

	render({
		selector: '.page_header',
		template: React.createElement(Header, {store: store})
	});

	request.
		get('http://swapi.co/api/starships/').
		end((err, response) => {
			emit({
				type: 'response',
				target: response
			});
		});

}

function cleanup () {
	router.stop();
}

init.again = function () {
	cleanup();
	init();
};

init();

////////////////////////////////////////////////////////////////////////////////
//
// Event Stream Processsing
//
var stream = emit.stream;



//
// general handlers -- these can mutate objects in the stream.
//
// stream = stream.map(...)
// stream = stream.map(e => {
// 	e.isMapped = true;
// 	return e;
// });



//
// Leaf node code - never mutate objects: split out functionality based on
// attributes of the event
//
// stream.map(e => {
// 	console.log(e);
// 	return e;
// });

// This allows for multiple subscribers
stream.share();

// stream.filter(...).map(...).forEach(...)
let knownTypes = [
	"message", "bootstrap", "mouseenter", "mouseleave", "mousemove",
	"mouseout", "mouseover", "mousedown", "mouseup", "click", "dblclick",
	"wheel", "scroll", "keypress", "keydown", "keyup", "input",
	"beforecopy", "copy", "paste", "change", "submit", "select",
	"selectstart", "selectionchange", "focus", "blur", "focusin",
	"focusout", "readystatechange", "load", "deviceorientation", "devicemotion",
	"contextmenu", "fb-flo-reload", "packet", "response"
];
stream
	.filter(e => !~knownTypes.indexOf(e.type))
	.forEach(failSafe(e => console.log(`Unknown event [${e.type}]:`, e)));


////////////////////////////////
// handle data from the server
stream
	.filter(e => e.type === "response")
	.forEach(failSafe(e => {
		console.log(e);
		var ships = store.get('starships') || [];
		ships = ships.concat(e.target.body.results)
		store.set('starships', ships);
		//recursively get more ships
		if (e.target.body.next) {
			request.
				get(e.target.body.next).
				end((err, response) => {
					emit({
						type: 'response',
						target: response
					});
				});
		}
		console.log(e.target.body);
		render();
	}))

/////////////////////
// handle text inputs
//
stream
	.filter(e => e.type === "change" || e.type === "input")
	.forEach(failSafe(e => {
		var bindingEl = findAncestorMatching(e.target, "[data-bind]");
		if (!bindingEl) { return; }
		var path = bindingEl.getAttribute("data-bind");
		var value = e.target.value;
		store.set(path, value);
		render();
	}));

/////////////////////
// handle clicks
//
// sorting
stream
	.filter(e => e.type === "click" && e.target.hasAttribute('data-sort'))
	.forEach(failSafe(e => {
		store.set('sort', e.target.getAttribute("data-sort"));
		render();
	}));

// navigation
stream
	.filter(e => {
		return e.type === "click" && 
			e.target.tagName.toLowerCase() === 'a' &&
			e.target.hasAttribute('data-action');
	})
	.forEach(failSafe(e => {
		e.preventDefault();
		navigate({
			action: e.target.getAttribute('data-action'),
			args: {
				id: e.target.getAttribute('data-args')
			}
		});
	}));


