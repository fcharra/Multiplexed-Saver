const MPSaver_SETTINGS = require('../misc/settings.js');

const helpers = require('../misc/helpers.js');
const entryFormatterVisitors = require('../misc/entryFormatterVisitors.js');
const fileFormatterStrategies = require('../misc/fileFormatterStrategies.js');

const Entry = require('../Entry.js');
const EntryQueue = require('../EntryQueue.js');

/**
* @main Soporte
*/
module.exports = class AbstractMediaLine extends helpers.Abstract {
  /**
  * Media lines specify different media behaviour for processing entries, and hold reference of those entries that are in their (media line's) possesion via a private EntryQueue object. This class abstracts away logic and attributes common to all the various implementations.
  * @class AbstractMediaLine
  * @constructor
  * @extends Helpers.Abstract
  * @param {Object} config Configuration parameters object.
  * @param {string|Globals.MEDIA} config.media Type of media to output log entries to.
  */
  constructor(config) {
    super();
    /**
    * Type of media to output entries to.
    * @public
    * @writeOnce
    * @property media
    * @type {Globals.MEDIA}
    */
    this.media = config.media || null;
    /**
    * List of entries that will be recorded. If not specified, all of the properties will be recorded.
    * @public
    * @writeOnce
    * @property fieldsArray
    * @type String[]
    */
    this.fieldsArray = config.fieldsArray || MPSaver_SETTINGS.DEFAULT_FIELDS_ARRAY;
    /**
    * Function to format this MediaLine's entries. It will depend on the desired output support, so that's why it has to be determined here.
    * @public
    * @writeOnce
    * @property entryFormatterVisitor
    * @type {entryFormatterVisitors.function}
    */
    this.entryFormatterVisitor = config.entryFormatterVisitor || MPSaver_SETTINGS.DEFAULT_FORMATTER;
    /**
    * Format to output in.
    * @protected
    * @writeOnce
    * @property fileFormatterStrategy
    * @type {string}
    */
    this.fileFormatterStrategy = config.fileFormatterStrategy || MPSaver_SETTINGS.DEFAULT_FILE_FORMATTER;
    /**
    * @protected
    * @writeOnce
    * @property queue
    * @type {EntryQueue}
    */
    this.queue = new EntryQueue(this);
    /**
    * Inner object that abstracts away common logic for processing entries.
    * @protected
    * @writeOnce
    * @property processor
    * @type {Processor}
    */
    this.processor = new Processor(this);

  }

  /**
  * Send an Entry with the specified parameters to the queue, to wait in line for processing.
  * @public
  * @method save
  * @param {Object} data Data to be logged.
  */
  save(data) {
    this.queue.push(new Entry(data, this.fieldsArray, this.entryFormatterVisitor));
  }

  /**
  * Called from this class' associated EntryQueue object to signal the availability of more entries waiting in line for processing. Delegates generic processing to this class' processing object.
  * @public
  * @method processNext
  */
  processNext() {
    this.processor.processEntry();
  }

  /**
  * !ABSTRACT! Send an entry to be processed by this media instance. Override this method when extending to implement new media. Remember to return a Promise when you do it.
  * @protected
  * @method processingFunction
  * @param {Entry} entry Entry object to be logged.
  * @return {Promise} True if resolved, Error object if rejected.
  */
  processingFunction(entry) {}

}

class Processor {
  /**
  * Inner class that abstracts away common logic for processing entries. Concrete instances' processingFunction methods get called internally to delegate logic specific to each kind of media.
  * @class Processor
  * @constructor
  * @param {AbstractMediaLine} context Stores a reference to this processor's owner class. */
  constructor(context) {
    /**
    * Stores a reference to this processor's owner class.
    * @protected
    * @writeOnce
    * @property context
    * @type {AbstractMediaLine}
    */
    this.context = context;
    /**
    * Indicates to the queue whether the processor is waiting until the media is ready to begin ('waiting'), is ready for more processing ('listening'), or is currently processing a log entry ('busy').
    * @protected
    * @property state
    * @type {string}
    */
    this.state = 'waiting';
  }

  /**
  * Used by media to signal they are ready to start receiving logs.
  * @public
  * @method mediaIsReady
  */
  mediaIsReady() {
    this.state = 'listening';
    this.context.processNext();
  }

  /**
  * Generic processing logic, common to all types of media. processingFunction gets called internally to delegate logic specific to each kind of media.
  * @protected
  * @async
  * @method processEntry
  */
  async processEntry() {
    if (this.state !== 'listening') return; // Not ready to process yet. Entry will be waiting in queue.
    let currEntry = this.context.queue.next();
    if (!currEntry) return; // "undefined" means we're done with the stack for the moment.

    this.state = 'busy';

    let strategy = this.context.processingFunction;
    let beforeEntryHook = this.context.fileFormatterStrategy.beforeEntryHook;
    let afterEntryHook = this.context.fileFormatterStrategy.afterEntryHook;

    /* But... Muh' encapsulation!!!
     * Yeah, some compromises were made to keep concerns
     * as separated and abstracted as possible... */
    try {
      await beforeEntryHook.call(this.context);
      await strategy.call(this.context, currEntry);
      await afterEntryHook.call(this.context);
      this.state = 'listening'; // Ready for more processing
      this.context.queue.doneProcessing();
    }
    catch(err) {
      // Failure to log individual events will not be considered a fatal error, but will be logged via normal error console.
      console.error('Could not save. ' + Error(err));
    }
  }

}
