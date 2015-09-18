'use strict';

// import Rx from 'rx';
// import ƒ from '../utils/Functional';

// var observer;

// var stream = Rx.Observable.create(newObserver => {
// 	observer = newObserver;
// 	return ƒ.noop;
// });


// export default function emit (event) {
// 	// use the javascript engine as the queue.
// 	observer.onNext(event);
// }

import { defer } from 'lodash';

class Stream {

	constructor(fn) {
		this.isShared = false;
		this.parent = parent;
		this.callbackChain = [];
		this.chain = false;
		this.children = [];
		this.storedValues = [];
		if (fn) this.callbackChain.push(fn);
	}

	onNext (value) {
		if (this.chain) {
			this.chain(value);
		} else {
			//save up the values
			this.storedValues.push(value);
			return;
		} 
	}

	share () {
		this.isShared = true;
		return this;
	}

	filter (fn) { 
		return this._appendLink((value, next) => {
			if (fn(value) && next) { 
				next(value); 
			}
		});
	}

	map (fn) { 
		return this._appendLink((value, next) => {
			value = fn(value);
			if (next) next(value);
		});
	}

	forEach(fn) { 
		return this._appendLink((value, next) => {
			fn(value);
			if (next) next(value);
		});
	}

	// reduce -- merge together group of events
	// slice  -- return a copy of this stream
	// concat -- join two streams

	_appendLink(fn) {
		var returnedStream;
		if (this.isShared) {
			let newChild = new Stream(fn);
			this.children.push(newChild);
			returnedStream = newChild;
		} else {
			this.callbackChain.push(fn);
			returnedStream = this;
		}

		//rebuild the chain
		let callbacks = this.callbackChain.slice();
		callbacks.push(value => {
			this.children.forEach( child => child.onNext(value));
		});
		this.chain = this.recursivelyBindChain(callbacks.shift(), callbacks);
		// if there are any stored values, defer them running through the newly
		// built chain
		if (this.storedValues.length) {
			defer(() => {
				this.storedValues.forEach((value) => this.onNext(value));
			});
		}

		//return either this or the newly created child;
		return returnedStream;
	}

	recursivelyBindChain(current, callbacks) {
		// base case
		if (!callbacks || callbacks.length === 0) {
			return current;
		} else {
			//recurse
			let next = this.recursivelyBindChain(callbacks.shift(), callbacks);
			return value => current(value, next);
		}

	}
}

let stream = new Stream();

export default function emit (event) {
	stream.onNext(event);
}

emit.stream = stream;
