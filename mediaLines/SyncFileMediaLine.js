const fs = require('fs');

const AbstractFileMediaLine = require('./AbstractFileMediaLine.js');

/**
* @main MultiplexedLogger
*/
module.exports = class SyncFileMediaLine extends AbstractFileMediaLine {
  /**
  * Implementation of MediaLine specific to synchronous file output.
  * @class SyncFileMediaLine
  * @constructor
  * @extends AbstractFileMediaLine
  * @param {Object} config Configuration parameters object. Inherits all of {{#crossLink "AbstractFileMediaLine"}}{{/crossLink}}'s config object parameters, plus the following:
  */
  constructor(config) {
    super(config);
  }

  /**
  * Logic for sync file processing of individual entries.
  * @private
  * @method processingFunction
  * @param {Entry} entry Entry object to be saved.
  * @return {Promise} True if resolved, Error object if rejected.
  */
  processingFunction(entry) {
    return new Promise( (resolve, reject) => {
      try {
        fs.appendFileSync(this.filePath, entry.toString(), 'utf8');
        if (this.fileState === 'blank') this.fileState = 'initiated';
        resolve(true);
      }
      catch (err) {
        reject(Error('FATAL ERROR: Could not append to file.'));
      }
    });
  }

}
