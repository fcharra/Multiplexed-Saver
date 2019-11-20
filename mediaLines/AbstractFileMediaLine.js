const fs = require('fs');

const MPSaver_SETTINGS = require('../misc/settings.js');
//const fileFormatterStrategies = require('../misc/fileFormatterStrategies.js');
const AbstractMediaLine = require('./AbstractMediaLine.js');

/**
* @main MultiplexedLogger
*/
module.exports = class AbstractFileMediaLine extends AbstractMediaLine {
  /**
  * Partial implementation of logging specific to files.
  * @class AbstractFileMediaLine
  * @constructor
  * @extends AbstractMediaLine
  * @param {Object} config Configuration parameters object. Inherits all of {{#crossLink "AbstractMediaLine"}}{{/crossLink}}'s config object parameters, plus the following:
  * @param {string} config.filePath Path to file, file name, and extension. Behaviour with other kinds of paths from nodejs fs module API remain untested at the moment.
  * @param {string} [config.fileFormat=MPSaver_SETTINGS.DEFAULT_FILE_FORMATTER] Format to output in.
  */
  constructor(config) {
    super(config);

    // Make class abstract
    if (new.target === this) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }

    // Settings specific to log files
    /**
    * String containing path to file, file name, and extension. Behaviour with other kinds of paths from nodejs fs module API remain untested at the moment.
    * @protected
    * @writeOnce
    * @property filePath
    * @type {string}
    */
    this.filePath = config.filePath ||
                   MPSaver_SETTINGS.OUT_DIR + MPSaver_SETTINGS.OUT_FILE;

    /**
    * Internal state of the file. It can either be:
    * 'waiting': File is NOT still created or properly formatted. This is an invalid state, and operations on the file should wait until it's changed.
    * 'blank': File is ready, but no logs have been written yet. Concrete media need to know this.)
    * 'initiated': File is ready, and logs have already been written to it. So no especial steps need to be taken before using it.
    * @public
    * @property fileState
    * @type {string}
    */
    this.fileState = 'waiting';

    // Initializing the file and properly closing it on exit.
    this._initializeFile();
    process.on('exit', () => this._closeFile() );

  }

  _initializeFile() {
    /* Processor waits until file is created and properly formatted, then signals it to start requesting entries from the queue.
    *  If file already exists, writeFile will delete before proceding.
    */
    fs.writeFile(this.filePath, this.fileFormatterStrategy.begin.call(this), 'utf8', (err) => {
      if (err) {
        console.error('FATAL ERROR: Could not create file.');
        throw Error(err);
      }

      this.fileState = 'blank';
      // Inform the processor this media is ready to process. (@todo Refactor this into a method.)
      this.processor.mediaIsReady();
    });
  }

  /* Closing the file is done synchronously. Otherwise, it doesn't gets done before closing.
  *  Reading and rewriting the entire file synchronously has now been changed to a single sync append, which still should reduce thread locking significantly.
  */
  _closeFile() {
    try {
      fs.appendFileSync(this.filePath, this.fileFormatterStrategy.end.call(this), 'utf8');
    }
    catch(err) {
      /* Failing to close will not be considered a fatal error, since the file can still be easily fixed by hand.
      * It will, however, be logged to standard error console.
      */
      console.error('Could not properly close file. ' + Error(err));
      return;
    }
  }

}
