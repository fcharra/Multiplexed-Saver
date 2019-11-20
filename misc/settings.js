const entryFormatterVisitors = require('./entryFormatterVisitors.js');
const fileFormatterStrategies = require('./fileFormatterStrategies.js');

module.exports = {

  OUT_DIR: process.argv[1],

  OUT_FILE: '-' +
            new Date()
              .toISOString()
              .replace(/:/g, '_'),

  DEFAULT_FIELDS_ARRAY: [],

  DEFAULT_FORMATTER: entryFormatterVisitors.entryFormatterVisitorCSV,

  DEFAULT_FILE_FORMATTER: fileFormatterStrategies.fileFormatterStrategyCSV,

  DEFAULT_REMOTEHOST: 'localhost',

  DEFAULT_REMOTEPORT: 8080

}
