var elasticsearch = require('./elasticsearch.js');
var config = require('./config.js');

console.log('configuring cluster to run the scripts');

elasticsearch = elasticsearch(config);

elasticsearch.getDataNodeNames(function(err, res, dataNodes) {
	console.log(dataNodes);
});