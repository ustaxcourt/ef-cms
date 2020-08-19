const efcmsCaseMappings = require('./efcms-case-mappings');
const efcmsDocumentMappings = require('./efcms-document-mappings');
const efcmsMessageMappings = require('./efcms-message-mappings');
const efcmsUserCaseMappings = require('./efcms-user-case-mappings');
const efcmsUserMappings = require('./efcms-user-mappings');

module.exports = {
  ['efcms-case']: efcmsCaseMappings,
  ['efcms-document']: efcmsDocumentMappings,
  ['efcms-message']: efcmsMessageMappings,
  ['efcms-user']: efcmsUserMappings,
  ['efcms-user-case']: efcmsUserCaseMappings,
};
