const MediaLineFactory = require('./mediaLines/MediaLineFactory.js');
const AbstractMediaLine = require('./mediaLines/AbstractMediaLine.js');

/**
* @module Soporte
*/
module.exports = class Logger {
  /**
  * Soporte's main entry point. Instantiate with proper configurations for each media, then use calling the {{#crossLink "Soporte/save:method"}}{{/crossLink}} method.
  * @class Soporte
  * @constructor
  * @param {Object[]} configArray Array of configurations. (Vary for each media.)
  */
  constructor(configArray) {
    /**
    * Array of media ({@link module:AbstractMediaLine} derived objects) that this Soporte will save to.
    * @public
    * @property mediaLine
    * @type {Object[]}
    */
    this.mediaLine = [];

    configArray.forEach( (config) =>
        this.mediaLine.push( MediaLineFactory(config) )
    )
  }

  /**
  * Save to all configured media, a given entry.
  * @public
  * @method save
  * @param {Object|Object[]} data The data to be saved.
  */
  save(data) {
    if (Array.isArray(data))
      this._saveBatch(data);
    else
      this._saveItem(data);
  }

  _saveBatch(dataBatch) {
    for(let i = 0; i < dataBatch.length; i++)
      this._saveItem(dataBatch[i]);
  }

  _saveItem(dataItem) {
    this.mediaLine.forEach( (media) => media.save(dataItem) );
  }

}
