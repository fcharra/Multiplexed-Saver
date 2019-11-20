module.exports = {

    entryFormatterVisitorCSV: function() {
        let result = "";
        this.fieldsArray.forEach( field => {
            result += this.data[field] + ",";
        });

        return result + '\n';
    }
  
  }
  