var scenario11 = require('./scenario11/scenario11.js');
var scenario12 = require('./scenario12/scenario12.js');
var scenario13 = require('./scenario13/scenario13.js');
var scenario21 = require('./scenario21/scenario21.js');

module.exports = function(self, options) {
	return {
		"11": scenario11(self, options),
		"12": scenario12(self, options),
		"13": scenario13(self, options),
		"21": scenario21(self, options)
	};
}