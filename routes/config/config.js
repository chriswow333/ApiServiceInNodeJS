
var req = require('require-yml');

var config = req('./routes/config/config.yml');

module.exports = config;