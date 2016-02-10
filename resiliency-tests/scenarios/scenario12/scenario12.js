'use strict';

var elasticsearch = require('../../elasticsearch.js');
var jmeter = require('../../jmeterRunner.js');
var async = require('async');
var config = require('../../config.js');

module.exports = function(runner, options) {

	elasticsearch = elasticsearch(options);
	jmeter = jmeter(options);
	
	var scriptsArgs = [
		2400, //40 min initial wait time.
		300, //5 min node down.
		options.cluster.username,
		config.cluster.clusterName,
		'su0nvm0' //Name of the cluster to restart.
	];

	var index1 = "sysone";
	var index2 = "systwo";

	return {
		name: "scenario12",
		run: function() {
			async.series([
				//prepare cluster.
				async.apply(elasticsearch.deleteIndex, index1),
				async.apply(elasticsearch.deleteIndex, index2),
				async.apply(elasticsearch.createIndex, index1),
				async.apply(elasticsearch.createIndex, index2),
				elasticsearch.applyTemplate,
				async.apply(elasticsearch.setReallocationTimeout, index1,'15m'),
				async.apply(elasticsearch.setReallocationTimeout, index2,'15m'),
				async.apply(runner.wait, 2000),
				runner.saveContextInfo,
				//run jmeter test.
				async.apply(jmeter.run, 'jmeter/plans/insert_query.jmx', {
					outputfile: options.outputFilePath,
					stage1duration: 900, //15 min pre-populate duration (inserts)
					stage2duration: 4200, //70 min run (inserts + queries),
					elasticip: options.cluster.loadBalancer.ip,
					index1name: index1,
					index2name: index2,
					clustername: options.cluster.clusterName,
					insertthreads: 1,
					querythreads: 6
				}),
				//run scripts.
				async.apply(
				  runner.runScripts,
				  'scenarios/scenario12/scenario12.sh',
				  `/home/${options.cluster.username}/scenario12.sh`,
				  scriptsArgs
				)
			],
			function (err, result) {
    			console.log(result);
			});
		}
	};
}