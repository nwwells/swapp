'use strict';

import _ from 'lodash';

// Helper functions for UUID generation
function s4 () {
	var result = Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	return result;
}

/****
 * uuid
 *
 * returns a randomly generated uuid, defined as a 128 bit integer, encoded
 * in hexadecimal digits, separated into 5 groups by hyphens in the
 * form: 8-4-4-4-12. This particular function returns a string with the A-F
 * digits in lower case.
 *
 * Additionally, since this is a Version 4 UUID, there are actually only 122
 * bits which are random. The 6 other digits are reserved by this version
 * of UUID.
 *
 * > console.log(uuid());
 * 'bf4c4f78-d60c-41e3-acb1-4a2eb19d27a5'
 */
export function uuid () {
	var v4String = '4' + s4().substr(1, 3);
	var reservedBits = [ '8', '9', 'a', 'b' ][Math.floor(Math.random() * 4)];
	var reservedString = reservedBits + s4().substr(1, 3);
	return s4() + s4() + '-' + s4() + '-' + v4String + '-' + reservedString + '-' + s4() + s4() + s4();
}


export function reloadApp () {
	window.location.reload(true);
}

//from http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
var statuses = {
	100: "Continue",
	101: "Switching Protocols",
	102: "Processing (WebDAV; RFC 2518)",
	200: "OK",
	201: "Created",
	202: "Accepted",
	203: "Non-Authoritative Information (since HTTP/1.1)",
	204: "No Content",
	205: "Reset Content",
	206: "Partial Content",
	207: "Multi-Status (WebDAV; RFC 4918)",
	208: "Already Reported (WebDAV; RFC 5842)",
	226: "IM Used (RFC 3229)",
	300: "Multiple Choices",
	301: "Moved Permanently",
	302: "Found",
	303: "See Other (since HTTP/1.1)",
	304: "Not Modified",
	305: "Use Proxy (since HTTP/1.1)",
	306: "Switch Proxy",
	307: "Temporary Redirect (since HTTP/1.1)",
	308: "Permanent Redirect (Experimental RFC; RFC 7238)",
	400: "Bad Request",
	401: "Unauthorized",
	402: "Payment Required",
	403: "Forbidden",
	404: "Not Found",
	405: "Method Not Allowed",
	406: "Not Acceptable",
	407: "Proxy Authentication Required",
	408: "Request Timeout",
	409: "Conflict",
	410: "Gone",
	411: "Length Required",
	412: "Precondition Failed",
	413: "Request Entity Too Large",
	414: "Request-URI Too Long",
	415: "Unsupported Media Type",
	416: "Requested Range Not Satisfiable",
	417: "Expectation Failed",
	418: "I'm a teapot (RFC 2324)",
	419: "Authentication Timeout (not in RFC 2616)",
	420: "Enhance Your Calm (Twitter)",
	422: "Unprocessable Entity (WebDAV; RFC 4918)",
	423: "Locked (WebDAV; RFC 4918)",
	424: "Failed Dependency (WebDAV; RFC 4918)",
	426: "Upgrade Required",
	428: "Precondition Required (RFC 6585)",
	429: "Too Many Requests (RFC 6585)",
	431: "Request Header Fields Too Large (RFC 6585)",
	440: "Login Timeout (Microsoft)",
	444: "No Response (Nginx)",
	449: "Retry With (Microsoft)",
	450: "Blocked by Windows Parental Controls (Microsoft)",
	451: "Redirect (Microsoft)",
	494: "Request Header Too Large (Nginx)",
	495: "Cert Error (Nginx)",
	496: "No Cert (Nginx)",
	497: "HTTP to HTTPS (Nginx)",
	498: "Token expired/invalid (Esri)",
	499: "Token required (Esri)",
	500: "Internal Server Error",
	501: "Not Implemented",
	502: "Bad Gateway",
	503: "Service Unavailable",
	504: "Gateway Timeout",
	505: "HTTP Version Not Supported",
	506: "Variant Also Negotiates (RFC 2295)",
	507: "Insufficient Storage (WebDAV; RFC 4918)",
	508: "Loop Detected (WebDAV; RFC 5842)",
	509: "Bandwidth Limit Exceeded (Apache bw/limited extension)[25]",
	510: "Not Extended (RFC 2774)",
	511: "Network Authentication Required (RFC 6585)",
	520: "Origin Error (CloudFlare)",
	521: "Web server is down (CloudFlare)",
	522: "Connection timed out (CloudFlare)",
	523: "Proxy Declined Request (CloudFlare)",
	524: "A timeout occurred (CloudFlare)",
	598: "Network read timeout error (Unknown)",
	599: "Network connect timeout error (Unknown)"
};
export function statusText (code) {
	return statuses[+code];
}

/***
* frontPadTo
*
* params -
* count: number of characters that the string must be padded to
* padChar: character used to pad the string
* toPad: the string to pad
*
* Example:
* var padded = frontPadTo(5, "A", "123")
* assert padded === "AA123"
*/
export function frontPadTo (count, padChar, toPad) {
	toPad = String(toPad);
	var padding = '';
	count -= toPad.length;

	while ((count -= 1) > 0) {
		padding += padChar;
	}
	return padding + toPad;
}


/**
 * arrayToObject
 *
 * converts an array to an object with keys being the indices of the
 * elements in the array.
 *
 * @param  {Array}  arr the array to convert
 * @return {Object}     the new object
 */
export function arrayToObject (arr) {
	var obj = {};
	arr.forEach(function (val, idx) { obj[idx] = val; });
	return obj;
}

export function toArray (arrayLike, from) {
	return Array.prototype.slice.call(arrayLike, from);
}

/**
 * ownKeys
 *
 * Returns an Array of the keys on an object, not in it's prototype chain.
 * Equivalent to Object.keys().
 *
 * @param  {Object} obj the object whose keys you want
 * @return {Array}      the keys of the object passed in.
 */
export function ownKeys (obj) {
	return Object.keys(obj);
}
/**
 * allKeys
 *
 * returns a list of all keys on an object, including those in it's
 * prototype chain.
 *
 * @param  {[type]} obj the object whose keys you want
 * @return {Array}     the keys of the object passed in.
 */
export function allKeys (obj) {
	var keys = [];
	for (var key in obj) keys.push(key);
	return keys;
}

export function uniq (arr) {
	var set = {};
	for (var i = arr.length - 1; i >= 0; i--) { set[arr[i]] = true; }
	return ownKeys(set);
}

/**
 * seq([from], to, [step|stepFunc])
 *
 * @param  {int}         from     the starting number (inclusive). Defaults
 *                                to 0;
 * @param  {int}         to       the ending number (inclusive).
 * @param  {int}         step     how much each new element increases over
 *                                the last. defaults to 1.
 * @param  {function(i)} stepFunc takes the last value and the current index
 *                                and returns the next value
 *
 * @return {Array}       an array containing the newly generated elements
 */
export function seq (from, to, step) {
	if (arguments.length === 1) {
		to = from;
		from = 0;
	}
	step = step || 1;
	var stepFunc = _.isFunction(step) ? step : function (value) {
		return value + step;
	};
	for (var i = 0, val = from, arr = []; val <= to; i++) {
		arr[i] = val;
		val = stepFunc(val, i);
	}
	return arr;
}

/**
 * traverse(obj, func, [useOwnKeys, [verbose, [traverseArrays]]])
 *
 * traverse iterates over an object's enumerable keys and calls func for
 * each key/value pair. If the value is an object or array, traverse will
 * also descend recursively and call func for all of that object's key/value
 * pairs (or idx/element pairs in the case of array.
 *
 * @param {Object|Array} obj         object to traverse
 * @param {Function}     func        the callback to call for each
 *                                   key/value pair
 * @param {Object}       opts        traversal options:
 *                       useOwnKeys  if true, will traverse prototype
 *                                   properties
 *                       verbose     If true, func will be called for
 *                                   array/object values in addition to
 *                                   recursing into them.
 *                       onlyObjects If true, arrays will not be traversed.
 * @param {Array}        path        for usage in the callback, the path to the
 *                                   current point in traversal
 */
export function traverse (obj, func, opts, path, parents) {
	var { useOwnKeys, verbose, onlyObjects } = opts;
	var originalObj = obj;
	path = path || [];
	parents = parents || [];
	if (obj instanceof Array) { obj = arrayToObject(obj); }
	var keys = useOwnKeys ? ownKeys(obj) : allKeys(obj);
	keys.forEach(function (key) {
		// traverse if
		var isTraversable = (
			// obj[key] is an array and we want to traverse arrays or if
			(obj[key] instanceof Array && !onlyObjects) ||
			// obj[key] is a real object and is not an array.
			(obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key]))
		);
		// if we're not going to traverse or in verbose mode, call func
		if (!isTraversable || verbose) { 
			func.call(null, originalObj, key, obj[key], path, parents);
		}
		// if we should traverse, traverse
		if (isTraversable) {
			//concat will take an array parent and concat it's values to parents
			let newParents = parents.slice();
			newParents.push(obj[key]);
			traverse(
				obj[key],
				func,
				{ useOwnKeys, verbose, onlyObjects },
				path.concat(key),
				newParents
			);
		}
	});
}

function findPath(obj, path, unfoundCallback) {
	path = path.split(/(\[|\.)/).reverse();
	let child = obj;
	for (let i = path.length - 1; i >= 0; i--) {
		if (path[i] === "." || path[i] === "[") { continue; }
		let parent = child;
		let isArrayRef = path[i].lastIndexOf("]") !== -1;
		let key = isArrayRef ? path[i].substr(0, path[i].length - 1) : path[i];
		if (isArrayRef) {
			child = _.find(parent, it => it.id === key);
		} else {
			child = parent[key];
		}
		if (child === null || child === undefined) {
			let result = unfoundCallback(parent, key, isArrayRef);
			// either a result is returned and we should return it too,
			if (result !== undefined) return result;
			// or the callback did something to ensure the child now exists,
			// and we should re-run the above to try and find it.
			if (isArrayRef) {
				child = _.find(parent, it => it.id === key);
			} else {
				child = parent[key];
			}
			if (child === null || child === undefined) {
				console.error("[findPath] unfoundCallback didn't work: child is still null or undefined.");
				return;
			}
		}
	}
	return child;
}

/**
 * [safeNav description]
 * @param  {[type]} obj  [description]
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
export function safeNav (obj, path) {
	return findPath(obj, path, function () {
		return null;
	});
}

export function ensurePath (obj, path) {
	return findPath(obj, path, function (parent, unfoundKey, isArrayRef) {
		if (isArrayRef) {
			parent.push({ id: unfoundKey });
		} else {
			parent[unfoundKey] = {};
		}
	});
}

export function applyBind (fn, context, args) {
	return fn.bind.apply(fn, [context].concat(toArray(args)));
}


export function pollAsync (fn, interval, context/*, args... */) {
	var pollArgs = arguments;
	var done = function () {
		window.setTimeout(
			applyBind(pollAsync, this, pollArgs),
			interval
		);
	};
	var args = toArray(arguments, 3);
	fn.apply(context, [done].concat(args));
	return done;
}

export function poll (fn, interval, context/*, args... */) {
	/* jshint validthis:true */
	//get args to for call to pollAsync, except fn
	var args = toArray(arguments, 1);
	//instead of fn, insert a wrapper fn that strips the "done" arg
	args.unshift(function (done) {
		//apply to array, except don't provide "done" arg.
		fn.apply(context, toArray(arguments, 1));
		//call done synchronously
		done();
	});
	//apply args to pollAsync:
	pollAsync.apply(this, args);
}

export function toJsonValue (x) {
	try {
		return JSON.parse(x);
	} catch (e) {
		return '"' + x + '"';
	}
}

var leftZeroPad = frontPadTo.bind(null, 2, '0');
export function formatUnixTimestampToDateTime (args) {
	var timestamp = args.timestamp;

	// multiplied by 1000 so that the argument is in milliseconds, not seconds
	var date = new Date(timestamp * 1000);
	//year part from the timestamp
	var year = date.getFullYear();
	//month part from the timestamp
	var month = date.getMonth() + 1;
	//date part from the timestamp
	var day = date.getDate();
	// hours part from the timestamp
	var hours = date.getHours();
	// minutes part from the timestamp
	var minutes = leftZeroPad(date.getMinutes());
	// seconds part from the timestamp
	var seconds = leftZeroPad(date.getSeconds());

	// will display time in 10:30:23 format
	var formattedDate = month + "/" + day + "/" + year + " " + hours + ':' + minutes + ':' + seconds;
	return formattedDate;
}

function getEmSize (element) {
	// Returns a number
	return parseFloat(
		// of the computed font-size (i.e. in px) for the root (<html>) element
		getComputedStyle(element).fontSize
	);
}

export function toPixels (string, context) {
	let [, value, unit] = string.match(/^(\d+)(.*)/), pixelValue;
	if (unit.toLowerCase() === 'rem') {
		pixelValue = value * getEmSize(document.documentElement);
	} else if (unit.toLowerCase() === 'em') {
		if (!context) {
			throw Error("No context specified when converting a \"em\" value to pixels.");
		}
		pixelValue = value * getEmSize(context);
	} else {
		throw Error(`Unsupported unit "${unit}" in conversion`);
	}
	return pixelValue;
}

export function getAlternative (value, alteratives) {
	var template = alteratives[value] || alteratives.other;
	var alternative = "";
	if (!template) {
		alternative = "Error: please contact tech support!";
	} else if (typeof template === 'string') {
		alternative = template;
	} else if (typeof template === 'function') {
		alternative = template(value);
	} else {
		alternative = "Error: please contact tech support!";
	}
	return alternative;
}

export function isArray (suspectedArray) {
	return Array.isArray(suspectedArray);
}

export function getData (data, path) {
	return data.get(path);
}

export function setData (data, path, value) {
	return data.set(path, value);
}

export function rollUp (childList, childrenKey, parentList, parentKey) {
	var groupedChildren = _.groupBy(childList, child => child[parentKey]);
	return _.pairs(groupedChildren).map(pair => {
		var parent = _.find(parentList, parentI => parentI.id === pair[0]);
		var children = {};
		children[childrenKey] = pair[1];
		return _.extend({}, parent, children);
	});
}

export function matchesSelector (element, selector) {
	var queryElement = element.parentElement || element.document || element.ownerDocument || document;
	var matches = queryElement.querySelectorAll(selector);
	var i = 0;

	while (matches[i] && matches[i] !== element) {
		i++;
	}

	return matches[i] ? true : false;
}

export function findAncestor (element, predicate) {
	while (element && !predicate(element)) {
		element = element.parentElement;
	}
	return element
}

export function findAncestorMatching (element, selector) {
	return findAncestor(element, e => matchesSelector(e, selector));
}

export function isCheckbox (element) {
	return element.type.toLowerCase() === "checkbox";
}

/**
 * Number.prototype.format(n, x, s, c)
 *
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 */
export function formatNumber (num, n, x, s, c) {
	var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')';
	num = num.toFixed(Math.max(0, ~~n));
	return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
}

export function formatCurrency (amount, unit) {
	var formatted = `${amount} ${unit}`;
	if (unit === "USD") {
		formatted = `$${formatNumber(amount, 0, 3, ',')}`;
	} else {
		console.warn("Unhandled currency type:", unit);
	}
	return formatted;
}

export function failSafe(fn) {
	return function () {
		return fn.apply(this, arguments);
	}
	
}

// taken from jquery-ui's implementation of scrollParent(),
// with the alteration that fixed elements still look for their scroll parent
// rather than returning true.
export function getScrollParent(element) {
	var includeHidden = false,
		position = getComputedStyle(element).position,
		excludeStaticParent = position === "absolute",
		overflowRegex = /(auto|scroll)/,
		scrollParent;
	if (position === "fixed") return true; //preservation of jquery-ui behavior

	scrollParent = findAncestor(element, parent => {
		parentStyle = getComputedStyle(parent);
		if ( excludeStaticParent && parentStyle.position === "static" ) {
			return false;
		}
		return overflowRegex.test(
			parentStyle.overflow  +
			parentStyle.overflowY +
			parentStyle.overflowX
		);
	});

	return !scrollParent ? element.ownerDocument || document : scrollParent;
}

export function getTotalOffsetTop (element) {
	var totalOffsetTop = 0;
	while (element) {
		totalOffsetTop += element.offsetTop;
		element = element.offsetParent;
	}
	return totalOffsetTop;
}

export function generatePaths (subject) {
	var paths = [];

	var getReference = function (object, parent, key) {
		return Array.isArray(parent) ? `[${object.id}]` : "." + key;
	};
	// set timestamp on all children of end node.
	traverse(subject, function (obj, key, value, pathArr, parents) {
		var reference = getReference(value, obj, key);

		/* path is defined as the reference to this object appended to
		 * the path of the parent object.
		 * if the current object is the child of an array (parent is an array)
		 * reference = "[${currentObject.id}]
		 * otherwise,
		 * reference = key
		 */
		var path = pathArr.reduceRight((memo, key, idx) => {
			let parent = idx > 0 ? parents[idx - 1] : subject;
			let currentReference = getReference(parents[idx], parent, key);
			return currentReference + memo;
		}, reference);
		paths.push(path);
	}, { useOwnKeys: true, verbose: true});
	return paths;
}


var alreadyImported = {};
export function importHtml (url) {
	var qualifiedUrl = /\.html$/.test(url) ? url : url + '.html';
	if (alreadyImported[qualifiedUrl]) return;
	var linkEl = document.createElement('link');
	linkEl.rel = 'import';
	linkEl.href = qualifiedUrl;
	document.head.appendChild(linkEl);
}

// export function scrollToElement (selector, offsetY) {
// 	var el = document.querySelector(selector);
// 		scrollParent = 
// 		scrollDuration = 1000,
// 		scrollHeight = window.scrollY,
// 		scrollStep = Math.PI / ( scrollDuration / 15 ),
// 		cosParameter = scrollHeight / 2,
// 		scrollCount = 0,
// 		scrollMargin,
// 		scrollInterval;

// 	if (!el) return;

// 	scrollInterval = setInterval(() => {
// 		if ( window.scrollY != 0 ) {
// 			scrollCount = scrollCount + 1;  
// 			scrollMargin = cosParameter - cosParameter * Math.cos( scrollCount * scrollStep );
// 			window.scrollTo( 0, ( scrollHeight - scrollMargin ) );
// 		} else {
// 			clearInterval(scrollInterval); 
// 		}
// 	}, 15 );
// }
