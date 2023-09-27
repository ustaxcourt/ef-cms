module.exports = {
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
