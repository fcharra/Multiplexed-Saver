const MPLogger_GLOBALS = require('./globals.js');

module.exports = {

  Abstract: class {
    /**
    * Duck-tape fix to provide Abstract capability to javascript.
    * @class Abstract
    * @constructor
    * @throws {TypeError} When code tries to instantiate it directly with the new keyword.
    */
    constructor() {
      if (new.target === this) {
        throw new TypeError("Cannot construct Abstract instances directly");
      }
    }
  }

}
