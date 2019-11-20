const fs = require('fs');

const AbstractFileMediaLine = require('./AbstractFileMediaLine.js');

/**
@main MultiplexedLogger
*/
module.exports = class AsyncFileMediaLine extends AbstractFileMediaLine {
  /**
  * Implementation of MediaLine specific to asynchronous file logging.
  * @class AsyncFileMediaLine
  * @constructor
  * @extends AbstractFileMediaLine
  * @param {Object} config Configuration parameters object. Inherits all of {{#crossLink "AbstractMediaLine"}}{{/crossLink}}'s config object parameters, plus the following:
  */
  constructor(config) {
    super(config);
  }

  /**
  * Logic for async file processing of individual entries.
  * @private
  * @method processingFunction
  * @param {Entry} entry Entry object to be saved.
  * @return {Promise} True if resolved, Error object if rejected.
  */
  processingFunction(entry) {
    return new Promise( (resolve, reject) => {
      fs.appendFile(this.filePath, entry.toString(), 'utf8', (err) => {
        if (err) reject( Error('FATAL ERROR: Could not append to the file.') );

        if (this.fileState === 'blank') this.fileState = 'initiated';
        resolve(true);
      });
    });
  }

}
