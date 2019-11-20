module.exports = {

    fileFormatterStrategyCSV: {
        begin: function() {
            return '';
        },

        beforeEntryHook: function() {
            return Promise.resolve(true);
        },

        afterEntryHook: function() {
            return Promise.resolve(true);
        },

        end: function() {
            return '';
        }
    }
  
  }
  