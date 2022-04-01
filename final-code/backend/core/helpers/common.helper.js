/* 
HELPER: CommonHelper
Purpose: Common Helper functions
Author: Dhanabalan.cs
 */
const htmlContentModel = require('../../models/admin/htmlContentModel');
const importedHtmlContentModel = require('../../models/admin/importedHtmlContentModel');
const videoContentModel = require('../../models/admin/videoContentModel');

module.exports = class CommonHelper {
    /**
     * Return DBModel Based on content Type
     * @static
     * @param {*} contentType
     * @return {*} 
     */
    static getDbModelByContentType(contentType) {
        let dbModel='';
        switch(contentType) {
            case 'HTML':
              dbModel=htmlContentModel;
              break;      
            case 'Imported HTML':
              dbModel=importedHtmlContentModel;
              break;      
            case 'Video':
              dbModel=videoContentModel;
              break;
          }
          return dbModel;         
    }
}