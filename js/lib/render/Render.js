'use strict';

import React from 'react';
import log from '../log/Log';

function maybe (object, key, message) {
	if (object === undefined) {
		return undefined;
	} else if (object[key] === undefined) {
		var args = message ? Array.prototype.slice.call(arguments, 2) : [ key, 'is undefined on', object ];
		log.error.apply(undefined, args);
	} else {
		return object[key];
	}
}

var cache = {};

function render (args) {
	if (!args) {
		for (let cachedSelector in cache) {
			render({
				selector: cachedSelector,
				template: cache[cachedSelector]
			});
		}
		return;
	}
	// var model = args.model || {};
	var template = maybe(args, 'template', 'You must specify a `template` for render to work');
	var selector = maybe(args, 'selector', 'You must specify a `selector` for render to work');
	var element = maybe(document.querySelectorAll(selector), 0, 'Attempted to render to an undefined element. Selector:', selector);
	if (!element) { return; }
	if (template._isReactElement) {
		React.render(template, element);
		cache[selector] = template;
	} else {
		console.error("Render: template is not a ReactElement!");
	}
}

export default render;
