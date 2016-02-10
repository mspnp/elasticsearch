var scenarios = require('./scenarios');
var es = require('./elasticsearch.js');
var dateformat = require('dateformat');
var fs = require('fs');
var path = require('path');
var scpClient = require('scp2');
var async = require('async');
var childprocess = require('child_process');
var mkdirp = require('mkdirp');

module.exports = function(options) {
	
	var self = this;
	var elastic = es(options);

	var mkdirSync = function (path) {
		 try {
		 	mkdirp.sync(path);
		 } catch(e) {
		 	if ( e.code != 'EEXIST' ) throw e;
		 }
	};

	self.run = function(scenario) {
		var test = scenarios(self, options)[scenario];
		options.testName = test.name;
		console.log(`running ${options.testName}`);

		var now = new Date();
		var outputFileName = `${dateformat(now, 'yyyymmddHHMM')}-${options.testName}`;
		options.outputFileName = outputFileName;
		var outputDir = path.join(options.resultsPath, outputFileName);
		options.outputDir = outputDir;
		options.outputFilePath = path.join(outputDir, outputFileName);
		options.windows = process.platform === 'win32';

		mkdirSync(outputDir);

		test.run();
	};

	self.saveContextInfo = function(callback) {
		if(options.verbose) {console.log('saving test context info')}
		var outputFile = path.join(options.outputDir, options.outputFileName) + '.txt';
		elastic.getClusterHealth(function(err, res, body) {
			fs.writeFileSync(outputFile, body);
			elastic.getClusterStatus(function(err, res, body) {
				fs.appendFileSync(outputFile, body);
				elastic.getIndexSettings(function(err, res, body) {
					fs.appendFileSync(outputFile, body);
					elastic.getNodesSettings(function(err, res, body) {
						fs.appendFileSync(outputFile, body);
						callback();
					});
				});
			});
		});
	}

	self.wait = function(millis, callback) {
		if(options.verbose) {console.log(`waiting ${millis} milliseconds.`)}
		setTimeout(function() {callback();}, millis);
	}

	self.runScripts = function(scriptsPath, scriptsRemotePath, scriptsArgs, callback) {
				
		async.series([
			//Copy the script into the jumpbox machine.
			function(callback) {
				if(options.verbose) {console.log(`copying scripts ${scriptsPath} to remote machine ${options.cluster.jumpboxIp}`)}
				scpClient.scp(scriptsPath, {
					host: options.cluster.jumpboxIp,
					username: options.cluster.username,
					password: options.cluster.password,
					path: `/home/${options.cluster.username}/`
				}, 
				function(err) {
					if (err) return callback(err);
					console.log('script copied to the remote machine');

					callback();
				});
			},
			//Execute script remotely.
			function(callback) {
				var jumpboxRemote = `${options.cluster.username}@${options.cluster.jumpboxIp}`;

				console.log('setting the remote script as executable');

				var plinkExecPath = path.join('lib', 'plink.exe');
				
				//make sure the script is marked as executable.
				if(options.windows) {
					childprocess.spawnSync(plinkExecPath, 
					[
						jumpboxRemote,
						'-l',
						options.cluster.username,
						'-pw',
						options.cluster.password,
						`chmod +x ${scriptsRemotePath}`
					]);
				} else {
					childprocess.execSync(`ssh -tt ${jumpboxRemote} chmod +x ${scriptsRemotePath}`);
				}

				var scenario;
				if(options.windows) {
					var args = [	
						'-ssh',
						jumpboxRemote,
						'-l',
						options.cluster.username,
						'-pw',
						options.cluster.password,
						scriptsRemotePath
					];

					var args = [].concat.apply(args, scriptsArgs);

					//run the script remotely.
					scenario = childprocess.spawn(plinkExecPath, args);
				} else {
					scenario = childprocess.exec(`ssh ${jumpboxRemote} ${scriptsRemotePath} ${scriptsArgs.join(" ")}`);
				}

				scenario.stdout.on('data', function (data) {
					console.log('test : ' + data);
				});

				scenario.stderr.on('data', function (data) {
					console.log('test :' + data);
				});

				if(options.windows) {
					scenario.stdin.write('y\n'); //this is to skip host confirmation from PLINK.
				}

				callback();
			}
		]);
		
	}

	return self;
}