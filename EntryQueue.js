const AbstractMediaLine = require('./mediaLines/AbstractMediaLine.js');
const Entry = require('./Entry.js');

/**
* @main Soporte
*/
module.exports = class EntryQueue {
  /**
  * Represents a queue of entries, ordered in a FIFO stack.
  * @class EntryQueue
  * @constructor
  * @param {AbstractMediaLine} mediaLine (Concrete) Medialine owner of this queue.
  */
  constructor(mediaLine) {
    /**
    * An instance from a concrete implementation of the MediaLine class, that this queue will belong to.
    * @private
    * @writeOnce
    * @property mediaLine
    * @type {AbstractMediaLine}
    */
    this.mediaLine = mediaLine;
    /**
    * @private
    * @property queue
    * @type {Entry[]}
    */
    this.queue = [];
  }

  /**
  * Register an entry in the queue. Entries will stay in the queue until it's their turn to be processed. This class's associated media line object directs the entire process transparently to the user of this class.
  * @method push
  * @param {Entry} entry Entry instance to be pushed to the queue. */
  push(entry) {
    this.queue.push(entry);
    this.mediaLine.processNext();
  }


  /**
  * Used by this class' associated media line object to signal its readiness to receive more logs. If this queue has log entries waiting in line to be processed, it will signal it back to the medialine object via {{#crossLink "AbstractMediaLine/processNext:method"}}its processNext method{{/crossLink}}, so that the processing can continue until the queue is empty.
  * @method doneProcessing
  */
  doneProcessing() {
    if (this.queue.length > 0)
      this.mediaLine.processNext();
  }

  /**
  * Pop and return the first element of the queue, which will be the oldest. (FIFO stack.)
  * @method next
  * @return {Entry|undefined} Oldest log entry in the stack. Undefined if stack is empty.
  */
  next() {
    return this.queue.shift();
  }

}
