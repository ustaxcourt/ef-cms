const efcmsCaseDeadlineMappings = require('./efcms-case-deadline-mappings');
const efcmsCaseMappings = require('./efcms-case-mappings');
const efcmsDocketEntryMappings = require('./efcms-docket-entry-mappings');
const efcmsMessageMappings = require('./efcms-message-mappings');
const efcmsUserMappings = require('./efcms-user-mappings');
const efcmsWorkItemMappings = require('./efcms-work-item-mappings');

/*

To use query predicates of "term" or "prefix", column mapping should be of
`type: "keyword"`
This is especially useful when combined with a `term` query when searching for
exact text matches (no wildcards) akin to `WHERE someCol="string literal"`

Columns which require full text analysis for searching keywords, stemming,
etc. should be of
`type: "text"`

If a column is to be returned from queries, but is NEVER the basis of a query predicate,
the mapping should contain
`index: false`,
This setting will prevent analysis during indexing.

*/

module.exports = {
  ['efcms-case']: efcmsCaseMappings,
  ['efcms-case-deadline']: efcmsCaseDeadlineMappings,
  ['efcms-docket-entry']: efcmsDocketEntryMappings,
  ['efcms-message']: efcmsMessageMappings,
  ['efcms-user']: efcmsUserMappings,
  ['efcms-work-item']: efcmsWorkItemMappings,
};
