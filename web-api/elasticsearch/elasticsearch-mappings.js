const efcmsCaseDeadlineMappings = require('./efcms-case-deadline-mappings');
const efcmsCaseMappings = require('./efcms-case-mappings');
const efcmsDocketEntryMappings = require('./efcms-docket-entry-mappings');
const efcmsMessageMappings = require('./efcms-message-mappings');
const efcmsUserCaseMappings = require('./efcms-user-case-mappings');
const efcmsUserMappings = require('./efcms-user-mappings');
const efcmsWorkItemMappings = require('./efcms-work-item-mappings');

module.exports = {
  ['efcms-case']: efcmsCaseMappings,
  ['efcms-case-deadline']: efcmsCaseDeadlineMappings,
  ['efcms-docket-entry']: efcmsDocketEntryMappings,
  ['efcms-message']: efcmsMessageMappings,
  ['efcms-user']: efcmsUserMappings,
  ['efcms-user-case']: efcmsUserCaseMappings,
  ['efcms-work-item']: efcmsWorkItemMappings,
};
