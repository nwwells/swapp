'use strict';

import Backbone from './BackboneRouter';
import { forEach }  from 'lodash';

//the backbone implementation of a Router.
var backboneRouter = new Backbone.Router();

//database of routes
var routes = {};

/****
 * interpolates route arguments using the backbone-style of route
 * definitions
 */
var OPTIONAL_PARAM = '\\(([^\\(]*):__key__\\)';
var NAMED_PARAM = '\\:__key__';
var SPLAT_PARAM = '\\*__key__';
function interpolateRouteArguments (route, args) {
	if (route === undefined) {
		throw new Error([
			'Tried to parse an undefined route:',
			route
		].join(' '));
	}
	args = args || {};

	forEach(args, function (value, key) {
		// NOTE: If performance is an issue, we could cache these regex for
		// each route/param combo.
		var optReg = new RegExp(OPTIONAL_PARAM.replace('__key__', key), 'g');
		var namedReg = new RegExp(NAMED_PARAM.replace('__key__', key), 'g');
		var splatReg = new RegExp(SPLAT_PARAM.replace('__key__', key), 'g');

		route = route.replace(optReg, '$1' + value);
		route = route.replace(namedReg, value);
		route = route.replace(splatReg, value);
	});

	// remove any optional params left
	var url = route.replace(/\(.*\)/g, '');

	// all routes generated should be relative to the base url, so
	// strip any '/'' at the beginning
	return url.indexOf('/') === 0 ? url.substr(1) : url;
}

export default {
	addRoute: function (args) {
		routes[args.action] = args.route;
		backboneRouter.route(
			args.route,
			args.action,
			args.callback
		);
	},
	navigate: function (args) {
		var route = routes[args.action];
		var path = interpolateRouteArguments(route, args.args);
		backboneRouter.navigate(
			path,
			{
				trigger: args.isTrigger,
				replace: args.isReplace
			}
		);
	},
	generateUrl: function (args) {
		return '#' + interpolateRouteArguments(routes[args.action], args.args);
	},
	start: opts => Backbone.history.start(opts),
	stop:  () => Backbone.history.stop()
};
