var childprocess = require('child_process');
var path = require('path');

module.exports = function(options) {

	var self = this;

	var runJmeterLinux = function(testOptions) {
		var jmeterExecPath = path.join(options.jmeterPath, 'bin/jmeter.sh');
		testOptions.unshift(jmeterExecPath);
		return childprocess.spawn('sh', testOptions);
	};

	var runJmeterWindows = function(testOptions) {
		var jmeterExecPath = path.join(options.jmeterPath, 'bin/jmeter.bat');
		return childprocess.spawn(jmeterExecPath, testOptions);
	};

	self.run = function(templatePath, args, callback) {
			
		var testOptions = [];

		if(options.remote) {
			testOptions.push('-r'); //run on the remote servers specified in jmeter.properties.
		}

		testOptions.push('-n'); //non-gui mode.

		for(var key in args) {
			testOptions.push(`-G${key}=${args[key]}`); //send as global parameter
			testOptions.push(`-J${key}=${args[key]}`); //send as local parameter
		}

		testOptions.push('-t');
		testOptions.push(templatePath);

		console.log('starting jmeter test');
		
		var test = null;
		if(options.windows) {
			test = runJmeterWindows(testOptions);
		} else {
			test = runJmeterLinux(testOptions);
		}

		test.stdout.on('data', function (data) {
    		console.log('jmeter: ' + data);
		});

		test.stderr.on('data', function (data) {
    		console.log('jmeter: ' + data);
    		process.exit();
		});

		test.on('close', function (code) {
    
    		if (code !== 0) {
        		console.log('testRun process exited with code ' + code);
    		}
    
    		console.log('exporting results...');

    		var jmeterExtPath = path.join(options.jmeterPath, 'lib/ext');

    		if(options.windows) {
    			childprocess.spawnSync('export.bat', [options.outputFileName, jmeterExtPath]);
    		}
    		else {
    			childprocess.spawnSync('export.sh', [options.outputFileName, jmeterExtPath]);
    		}
   			
   			console.log('export finished.');
		});

		callback();
	}

	return self;
};