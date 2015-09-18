'use strict';

function log (opts) {
	console[opts.level].apply(console, opts.args);
}

[ 'log', 'warn', 'debug', 'error' ].forEach(key => {
	log[key] = (...args) => log({ level: key, args: args });
});

export default log;
