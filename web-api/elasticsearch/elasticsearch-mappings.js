const efcmsCaseMappings = require('./efcms-case-mappings');
const efcmsDocketEntryMappings = require('./efcms-docket-entry-mappings');
const efcmsMessageMappings = require('./efcms-message-mappings');
const efcmsUserCaseMappings = require('./efcms-user-case-mappings');
const efcmsUserMappings = require('./efcms-user-mappings');

module.exports = {
  ['efcms-case']: efcmsCaseMappings,
  ['efcms-docket-entry']: efcmsDocketEntryMappings,
  ['efcms-message']: efcmsMessageMappings,
  ['efcms-user']: efcmsUserMappings,
  ['efcms-user-case']: efcmsUserCaseMappings,
};
