"use strict";

import defaultData from './Data';
import { omit, pick, some } from 'lodash';
import { safeNav, ensurePath, generatePaths } from '../utils/Utils';

class DataStore {

	constructor(data) {
		this.data = data;
		this.timestamps = {};
	}

	get (path) {
		return safeNav(this.data, path);
	}

	set (path, value) {
		//TODO - handle array options
		var data = this.data;
		var timestamp = Date.now();
		var matches = path.match(/(.*)\.(.*)/);
		var object = (matches) ? ensurePath(data, matches[1]) : data;
		var key = (matches) ? matches[2] : path;
		object[key] = value;
		
		// set time stamp on each step of the set path
		var pathDown = path;
		var match;
		do {
			this.stamp(pathDown, timestamp);
			match = pathDown.match(/(.*)(\.[^\.\[\]]+|\[[^\[\]]+\])$/);
		} while (pathDown = (match) ? match[1] : false)


		// set timestamp on all children of end node.
		var paths = generatePaths(object[key]);
		paths.forEach((relativePath) => this.stamp(path+relativePath, timestamp));

		return value;
	}

	stamp (path, time) {
		this.timestamps[path] = time;
	}

	stamps (paths) {
		var now = Date.now();
		paths
			.filter(path => !this.timestamps[path])
			.forEach(path => this.timestamps[path] = now);
		return paths ? pick(this.timestamps, paths) : omit(this.timestamps);
	}

	isChanged(stamps) {
		return some(stamps, (stamp, path) => this.timestamps[path] > stamp);
	}
}

let data = window.data = defaultData;
let singletonInstance = window.store = new DataStore(data);

export default singletonInstance;
