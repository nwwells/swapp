'use strict';

import emit from './lib/events/Emit';
import addDomEvents from './lib/events/AddDomEvents';

import router from './lib/navigation/Router';
// import StarWarsController from './feature/star-wars/StarWarsController';

import render from './lib/render/Render';
import Header from './feature/header/Header.jsx';
import React from 'react';

import data from './lib/data/Store';

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
		template: React.createElement(Header, {data: data})
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
	"contextmenu", "fb-flo-reload", "packet"
];
stream
	.filter(e => !~knownTypes.indexOf(e.type))
	.forEach(failSafe(e => console.log(`Unknown event [${e.type}]:`, e)));


