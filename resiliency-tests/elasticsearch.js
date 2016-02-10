'use strict';

var request = require('request');
var _ = require('lodash');

module.exports = function(config) {
	return {
		deleteIndex: function(indexName, callback) {
			if(config.verbose) { console.log(`deleting index ${indexName}`)}
			request({
				uri: `${config.cluster.loadBalancer.url}/${indexName}`,
				method: 'DELETE'
			}, callback);
		},
		createIndex: function(indexName, callback) {
			if(config.verbose) { console.log(`creating index ${indexName}`)}
			request({
				uri: `${config.cluster.loadBalancer.url}/${indexName}`,
				method: 'PUT',
				json: {
					"settings": {
						"index.number_of_replicas": config.testIndex.replicas,
						"index.number_of_shards": config.testIndex.shards
					}
				}
			}, callback);
		},
		applyTemplate: function(callback) {
			if(config.verbose) { console.log(`applying custom index settings`)}
			request({
				uri: `${config.cluster.loadBalancer.url}/_template/${config.testIndex.template.templateName}`,
				method: 'PUT',
				json: config.testIndex.template.templateBody
			}, callback);
		},
		getClusterHealth: function(callback) {
			if(config.verbose) { console.log(`getting cluster health of ${config.cluster.clusterName}`)}
			request({
				uri: `${config.cluster.loadBalancer.url}/_cluster/health?pretty`,
				method: 'GET'
			}, callback);
		},
		getClusterStatus: function(callback) {
			if(config.verbose) { console.log(`getting cluster status of ${config.cluster.clusterName}`)}
			request({
				uri: `${config.cluster.loadBalancer.url}?pretty`,
				method: 'GET'
			}, callback);
		},
		getIndexSettings: function(callback) {
			if(config.verbose) { console.log(`getting settings of index ${config.testIndex.indexName}`)}
			request({
				uri: `${config.cluster.loadBalancer.url}/${config.testIndex.indexName}/_settings?pretty`,
				method: 'GET'
			}, callback);
		},
		getNodesSettings: function(callback) {
			if(config.verbose) { console.log(`getting cluster node settings of ${config.cluster.clusterName}`)}
			request({
				uri: `${config.cluster.loadBalancer.url}/_nodes/process?pretty`,
				method: 'GET'
			}, callback);
		},
		setReallocationTimeout: function(indexName, timeout, callback) {
			request({
				uri: `${config.cluster.loadBalancer.url}/${indexName}/_settings`,
				method: 'PUT',
				json: {
					"settings": {
						"index.unassigned.node_left.delayed_timeout": timeout
					}
				}
			}, callback);
		},
		getAllNodes: function(callback) {
			 
			request({
				uri: `${config.cluster.loadBalancer.url}/_cat/nodes?v=&h=host,node.role`,
				method: 'GET'
			}, callback);
		},
		getDataNodeNames: function(callback) {
			if(config.verbose) { console.log(`getting data nodes of cluster ${config.cluster.clusterName}`)}
			request({
				uri: `${config.cluster.loadBalancer.url}/_nodes`,
				method: 'GET'
			}, function(err, res, body)
			{
				body = JSON.parse(body);
				var dataNodes = _.filter(body.nodes, function(n) {
  					return n.settings.node.data == 'true'
				});

				var names = _.pluck(dataNodes, 'host');
				names = _.sortBy(names, function(n) {
					return n;
				});

				callback(err, res, names);
			});
		}
	}
}