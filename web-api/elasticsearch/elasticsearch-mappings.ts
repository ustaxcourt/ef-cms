import {
  efcmsCaseDeadlineIndex,
  efcmsCaseDeadlineMappings,
} from './efcms-case-deadline-mappings';
import { efcmsCaseIndex, efcmsCaseMappings } from './efcms-case-mappings';
import {
  efcmsDocketEntryIndex,
  efcmsDocketEntryMappings,
} from './efcms-docket-entry-mappings';
import {
  efcmsMessageIndex,
  efcmsMessageMappings,
} from './efcms-message-mappings';
import { efcmsUserIndex, efcmsUserMappings } from './efcms-user-mappings';
import {
  efcmsWorkItemIndex,
  efcmsWorkItemMappings,
} from './efcms-work-item-mappings';

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

export const elasticsearchMappings = {
  [efcmsCaseDeadlineIndex]: efcmsCaseDeadlineMappings,
  [efcmsCaseIndex]: efcmsCaseMappings,
  [efcmsDocketEntryIndex]: efcmsDocketEntryMappings,
  [efcmsMessageIndex]: efcmsMessageMappings,
  [efcmsUserIndex]: efcmsUserMappings,
  [efcmsWorkItemIndex]: efcmsWorkItemMappings,
};
