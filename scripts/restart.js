const { exec } = require('node:child_process');

async function startReso() {
	exec('npm start', (error, stdout, stderr) => {
		if (error) {
			console.error(`Error starting Reso: ${error}`);
			return;
		}
		if (stderr) {
			console.error(`Error starting Reso: ${stderr}`);
		}
	});
}

setTimeout(startReso, 5000);