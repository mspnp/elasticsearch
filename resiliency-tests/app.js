'use strict';

var program = require('commander');
var prompt = require('prompt');
var config = require('./config.js');
var testRunner = require('./testRunner.js');
var _ = require('lodash');

program
  .version('0.0.1')
  .option('-s, --scenario [number]', 'Run the specified scenario')
  .parse(process.argv);

if (!program.scenario) {
    
    console.log('choose an scenario to run:');
    console.log('----------------------------------------------------');
    console.log('Reliability Testing Scenarios');
    console.log('----------------------------------------------------');
    console.log('[11] Scenario 1.1 -> No re-allocation w/o data loss');
    console.log('[12] Scenario 1.2 -> No re-allocation w data loss');
    console.log('[13] Scenario 1.3 -> Re-allocation w/o data loss');
    console.log('[21] Scenario 2.1 -> Rolling updates');
    console.log('----------------------------------------------------');
    
    prompt.start();
    prompt.get(['scenario'], function (err, result) {
        
        if (err) {
            console.log(err);
            process.exit();
        }

        testRunner(config).run(result.scenario);
        
    });
}
else {
    testRunner(config).run(program.scenario);
}