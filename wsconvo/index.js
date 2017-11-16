class convo {
	constructor (ws=null, talkback, options={}) {
		if (!ws) {
			throw new TypeError('Websocket cannot be null when using wsconvo.');
		}

		if (typeof(options) !== 'object') {
			options = {};
		}

		this.ws = ws || null;
		this.talkback = talkback || function () {}; // the function to run onmessage
		this.options = options || {};
		this.IDlisteners = {};

		this.ws.on('message', (data) => this.onMessage(data));
	}

	generateID (length=4) {
		var str = '';
		for (var i = 0; i < length; i++) {
			str += Math.random().toString(Math.floor(Math.random()*(36-2))+2)
		}
		return str;
	}

	createNewListener (func, id) {
		if (this.IDlisteners[id]) {
			return this.IDlisteners[id];
		}

		return this.IDlisteners[id] = func;
	}

	send (data, func, id) {
		if (typeof(data) === 'object') {
			if (!id) {
				id = this.generateID();
			}
			
			data.id = id;

			data = JSON.stringify(data);
		}

		this.ws.send(data);

		this.createNewListener(func, id);
		
		return this;
	}

	onMessage (data, ...otherArgs) {
		var origData = data;
		try {
			data = JSON.parse(data);
		} catch (err) {
			// skips error, because it's not json, which is what we are testing for
			data = data; 
		}

		var args = {
			originalData: origData,
			data,
			reply: (replyData, func) => {
				this.send(replyData, func, data.id)
			}
		};

		

		if (data.id) {
			if (typeof(this.IDlisteners[data.id]) === 'function') {
				let func = this.IDlisteners[data.id];
				this.IDlisteners[data.id] = null;
				func(args); 
			}
		}

		if (typeof(this.talkback) === 'function') {
			this.talkback(args, data, ...otherArgs);
		}
	}



	static create (...args) { // simply the same as new convo(...args), for use in direct require
		return new convo(...args);
	}
}



module.exports = convo;