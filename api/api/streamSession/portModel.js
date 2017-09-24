var Heap = require('heap');
var shell = require('shelljs');
var ports = new Heap();

for(var i = 6001; i<=7000; i++) {
	ports.push(i);
}

module.exports = {
	getPort: function() {
		return ports.pop();
	},

	returnPort: function(ls_port, callback) {
		console.log("returning port");
		var command = `lsof -i :${ls_port} | grep liquidsoa`;
		shell.exec(command, function(code, stdout, stderr) {
			if(stderr)
			{
				callback(stderr);
				return;
			}
			try {
				var i = stdout.indexOf(' ') + 1;
				var i2 = stdout.indexOf(' ', i);
				var pid = parseInt(stdout.substring(i,i2));
				console.log("Killing process with PID " + pid);
				if(!isNaN(pid)) {
					var command = `kill -9 ${pid}`;
					shell.exec(command, function(code, stdout, stderr) {
						if(stderr) {
							callback(stderr);
							return;
						}
					})
				}
				ports.push(ls_port);
				callback(null);
			} catch(e) {
				callback("Error in returning ports: " + e);
			}
			
		});
	}
}