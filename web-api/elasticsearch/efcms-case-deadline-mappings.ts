import { Property } from '@opensearch-project/opensearch/api/_types/_common.mapping';
import { createHash } from 'crypto';

export const efcmsCaseDeadlineMappings: Property = {
  properties: {
    'associatedJudge.S': {
      type: 'text',
    },
    'caseDeadlineId.S': {
      type: 'keyword',
    },
    'deadlineDate.S': {
      type: 'date',
    },
    'description.S': {
      type: 'text',
    },
    'docketNumber.S': {
      type: 'keyword',
    },
    'entityName.S': {
      type: 'keyword',
    },
    'sortableDocketNumber.N': {
      fields: {
        keyword: {
          type: 'keyword',
        },
      },
      type: 'integer',
    },
  },
};

const efcmsCaseDeadlineMappingsHash: string = createHash('md5')
  .update(JSON.stringify(efcmsCaseDeadlineMappings), 'utf8')
  .digest('hex');

export const efcmsCaseDeadlineIndex: string = `efcms-case-deadline-${efcmsCaseDeadlineMappingsHash}`;
