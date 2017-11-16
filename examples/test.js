var childProc = require('child_process');

var Server = childProc.spawn('node', ['./server/main.js']);

Server.stdout.on('data', data => {
	console.log('SERVER:', data.toString());
});

Server.stderr.on('data', data => {
	console.log('SERVER-ERROR:', data.toString());
});

Server.on('close', code => {
	console.log('====SERVER CLOSED====');
});

var Client = childProc.spawn('node', ['./client/client.js']);

Client.stdout.on('data', data => {
	console.log('CLIENT:', data.toString());
});

Client.stderr.on('data', data => {
	console.log('CLIENT-ERROR:', data.toString());
});

Client.on('close', code => {
	console.log('====CLIENT CLOSED====');
});