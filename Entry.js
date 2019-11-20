const settings = require('./misc/settings.js');
const visitors = require('./misc/entryFormatterVisitors.js');

/**
* @main Soporte
*/
module.exports = class Entry {
  /**
  * Represents an individual entry in the log.
  * @class Entry
  * @constructor
  * @param {Object} data Entry to be logged, in javascript object format.
  */
  constructor(data, fieldsArray = settings.DEFAULT_FIELDS_ARRAY, entryFormatterVisitor = settings.DEFAULT_FORMATTER) {
    /**
    * Fields of the entry to be saved. Overwrite in the concrete class.
    * @writeOnce
    * @property fieldsArray
    * @type String[]
    */
    this.fieldsArray = fieldsArray
    /**
    * Data object to be saved.
    * @writeOnce
    * @property data
    * @type {Object}
    */
    this.data = this._stripKeys(data);
    /**
    * Visitor that will format this Entry's output (toString method).
    * @writeOnce
    * @property entryFormatterVisitor
    * @type visitors.function
    */
    this.entryFormatterVisitor = entryFormatterVisitor;
  }

  /**
  * Returns an Entry-formatted string representing the entry, from the object. 
  * @method _acceptFormatterVisitor
  * @param {visitors.function} entryFormatterVisitor A visitor function to format this Entry data.
  * @return {string} An Entry-formatted string to be saved.
  */
  _acceptFormatterVisitor(entryFormatterVisitor) {
    return entryFormatterVisitor.call(this);
  }

  /**
  * Returns an Entry-formatted string representing the entry, from the object. 
  * @method toString
  * @return {string} An Entry-formatted string to be saved.
  */
  toString() {
    return this._acceptFormatterVisitor(this.entryFormatterVisitor);
  }

  /**
  * Strips keys from the object that are not in the fields array. If the fieldsArray is empty, it returns the whole object. (As it is assumed, all keys are needed.)
  * @method _stripKeys
  * @param {Object} data Data object to be saved. MUST have at least one key-value pair.
  * @return {Object} Data object to be saved, stripped from unnecessary keys.
  */
  _stripKeys(data) {
    // TODO: Maybe "if (Object.keys(data).length === 0) return data;"
    // If no fields are specified...
    if (this.fieldsArray.length === 0) {
      // ...then just include every key as a "concern", and return the object "as is".
      this.fieldsArray = Object.keys(data);
      return data;
    }

    // ...otherwise
    let result = {};
    this.fieldsArray.forEach( field => {
      // Check that the given object has all required fields defined. Populate the result object with the fields.
      if (data[field] === undefined) {
        throw new Error("Objeto incompleto.");
      } else {
        result[field] = data[field];
      }
    });

    return result;
  }

}
