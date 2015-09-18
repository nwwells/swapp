'use strict';

const USE_CAPTURE = true;

function getEventNames (object) {
	let names = [];
	for (let name in object) {
		if (name.indexOf('on') === 0) {
			names.push(name.substr(2));
		}
	}
	return names;
}


export default function addDomEvents (emit) {
	let windowEvents = getEventNames(window);
	let documentEvents = getEventNames(document);
	let i, eventName;

	for (i = documentEvents.length - 1; i >= 0; i--) {
		eventName = documentEvents[i];
		document.addEventListener(eventName, emit, USE_CAPTURE);
		windowEvents.splice(windowEvents.indexOf(eventName), 1);
	}

	for (i = windowEvents.length - 1; i >= 0; i--) {
		eventName = windowEvents[i];
		window.addEventListener(eventName, emit, USE_CAPTURE);
	}

	window.addEventListener('fb-flo-reload', emit);
}
