'use strict';

import navigate from './Navigate';
import router from './Router';

function beforeAction () {
	// preview actions - i.e. clear site subtitle... manage breadcrumbs
}

function afterAction () {
	// do something after actions are processed
}

function qualifyActionName (controller, actionName) {
	return controller.name + '.' + actionName;
}

function addRouterToController (controller, actionName, route) {
	router.addRoute({
		action:   qualifyActionName(controller, actionName),
		route:    route,
		callback: function () {
			beforeAction(controller, actionName, route, arguments);
			var result = controller[actionName].apply(controller, arguments);
			afterAction(result, controller, actionName, route, arguments);
		}
	});
}

class Controller {
	constructor (opts) {
		this.name = opts.name;
		if (!this.name) {
			throw Error('Controllers must specify a `name` argument');
		}
		this.routes = opts.routes;
		Object.keys(opts.routes).forEach(this.registerRoute(opts));
	}

	registerRoute (opts) {
		return function (actionName) {
			let route = opts.routes[actionName];
			if (!opts[actionName]) {
				throw Error(`Action "${actionName}" is not defined on the controller named "${ opts.name }"!`);
			}
			this[actionName] = opts[actionName].bind(this);
			addRouterToController(this, actionName, route);
		}.bind(this);
	}
}

Controller.redirect = function (actionName) {
	return function () {
		navigate({
			action:  actionName,
			trigger: true,
			replace: true
		});
	};
};

export default Controller;
