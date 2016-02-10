'use strict';

var config = {};
config.jmeterPath = 'C:/apache-jmeter-2.13';
config.resultsPath = 'results';
config.verbose = true;
config.remote = false;

config.cluster = {};
config.cluster.clusterName = 'YOUR_ELASTIC_SEARCH_CLUSTER_NAME';
config.cluster.jumpboxIp = 'YOUR_JUMPBOX_IP';
config.cluster.username = 'YOUR_USER';
config.cluster.password = 'YOUR_PASSWORD';

config.cluster.loadBalancer = {};
config.cluster.loadBalancer.ip = 'YOUR_LOADBALANCER_IP';
config.cluster.loadBalancer.url = 'http://YOUR_LOADBALANCER_IP:9200';

config.testIndex = {};
config.testIndex.indexName = 'systwo';  //default you can change your index here
config.testIndex.replicas = 1;          // # of Replicas for this Index
config.testIndex.shards = 5;            // # of Shards for this Index

config.testIndex.template = {};
config.testIndex.template.templateName = 'perftemplate';
config.testIndex.template.templateBody = {
  "template": "sys*",
  "order": 1,
  "settings": {
    "refresh_interval": "30s"
  },
  "mappings": {
    "_default_": {
      "_all": {"enabled": false},
      "dynamic_templates": [
        {
        "notanalyzed": {
              "match": "*", 
              "match_mapping_type": "string",
              "mapping": {
                  "type": "string",
                  "index": "not_analyzed"
              }
           }
        }
      ]
    }
  }
};

module.exports = config;