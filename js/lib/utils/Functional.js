'use strict';

export default function f (it) { return function () { return it; }; }

f.T      = function ()   { return true;  };
f.F      = function ()   { return false; };
f.noop   = function ()   { return;       };
f.I      = function (it) { return it;    };
f.not    = function (it) { return !it;   };
f.truthy = function (it) { return !!it;  };

// Higher Order Functions
f.startsWith = function (search) {
	return function (it) { return it.indexOf(search) === 0; };
};

f.get = function (childKey) {
	return it => it[childKey];
};

f.perform = function (methodName, ...args) {
	return function (it) { return it[methodName].apply(it, args); };
};

f.construct = function (Constructor) {
	return function (...args) {
		var newObj = Object.create(Constructor.prototype);
		var result = Constructor.apply(newObj, args);
		return (typeof result === 'object' && result) || newObj;
	};
};
f.compose = function (...fns) {
	var numFns = fns.length;
	return function (...args) {
		var i, returnValue = fns[numFns - 1].apply(this, args);
		for (i = numFns - 2; i > -1; i--) {
			returnValue = fns[i](returnValue);
		}
		return returnValue;
	};
};

f.sum = function (key) {
	return function (previousValue, current) {
		return previousValue + current[key];
	};
};
