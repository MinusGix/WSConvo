var WebSocket = require('ws');

var Server = new WebSocket.Server({ port: 9090 });
var Convo = require('../../wsconvo/index.js');

Server.on('connection', function (socket) {
	socket.convo = new Convo(socket, (args) => {
		if (args.data.response === 'connected') {
			console.log('Requesting username');
			args.reply({ request: 'username' }, (args) => {
				var username = args.data.response;
				console.log('username:', username);
				console.log('Requesting hour');
				args.reply({ request: 'hour' }, (args) => {
					var hour = args.data.response;
					console.log('hour:', hour);
					args.reply({ request:'done' });
				});
			})
		}
	});
});

Server.on('listening', function () {
	console.log('server started'); // think this should work
})
