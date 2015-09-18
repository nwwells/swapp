'use strict';

import router from './Router';

function navigate (args) {
	var action = args.action;
	var routeArgs = args.args;
	var isTrigger = args.trigger === false ? false : true;
	var isReplace = args.replace === true ? true : false;
	router.navigate({
		action:    action,
		args:      routeArgs,
		isTrigger: isTrigger,
		isReplace: isReplace
	});
}

export default navigate;
