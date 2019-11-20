const Soporte = require('../Soporte.js');

var soporte = new Soporte([
                   {
                     media: 'FILE',
                     filePath: './test-entry-async.csv'
                   },
                   {
                     media: 'CONSOLE'
                   }
                 ]);

soporte.save({id: 1, name: "Jorge", gender: "M"});
soporte.save({id: 2, name: "Isabella", gender: "F"});
soporte.save({id: 4, name: "Ana", gender: "F"});