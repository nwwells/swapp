'use strict';

export default function addSocketEvents (emit, io) {
	// override the ioEmit handler
	var onConnect = (connectEvent) => {
		var ioEmit = io.socket._raw.io.emit;
		io.socket._raw.io.emit = function (type, event) {
			emit({
				type:   type,
				data:   event,
				target: this
			});
			return ioEmit.apply(this, arguments);
		};
		emit({
			type:   "connect",
			data:   connectEvent,
			target: io.socket
		});
		io.socket.off('connect', onConnect);
	};
	io.socket.on('connect', onConnect);
}
