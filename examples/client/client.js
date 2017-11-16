var WebSocket = require('ws');

var Client = new WebSocket('ws://localhost:9090');

var convo = require('../../wsconvo/index.js').create(Client, (args) => {
});


Client.on('open', function () {
	console.log('Client started');
	convo.send({ response: 'connected' }, args => {
		console.log('sending username');
		args.reply({ response: 'MinusGix' }, args => {
			console.log('sending hour');
			args.reply({ response: (new Date()).getHours() }, args => {
				console.log('Convo ended');
			});
		});
	});
});

