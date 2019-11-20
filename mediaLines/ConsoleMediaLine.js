const AbstractMediaLine = require('./AbstractMediaLine.js');

/**
@main Soporte
*/
module.exports = class ConsoleMediaLine extends AbstractMediaLine {
  /**
  * Initialize basic configuration for console output.
  * @class ConsoleMediaLine
  * @constructor
  * @extends AbstractMediaLine
  * @param {Object} config Configuration parameters object. Inherits all of {{#crossLink "AbstractMediaLine"}}{{/crossLink}}'s config object parameters, plus the following:
  */
  constructor(config) {
    super(config);
    // Inform the processor this media is ready to process.
    this.processor.mediaIsReady();
  }

  /**
  * @private
  * @method processingFunction
  * @param {Entry} entry Entry object to be saved.
  * @return {Promise} True if resolved, Error object if rejected.
  */
  processingFunction(entry) {
    return new Promise( (resolve, reject) => {
      if (!entry) reject(Error("Invalid or null entry"));
      else console.log( entry.toString() );

      resolve(true);
    });
  }
}
