module.exports = {
  properties: {
    'associatedJudge.S': {
      type: 'text',
    },
    'caseDeadlineId.S': {
      type: 'text',
    },
    'deadlineDate.S': {
      type: 'date',
    },
    'description.S': {
      type: 'text',
    },
    'docketNumber.S': {
      type: 'text',
    },
    'entityName.S': {
      type: 'text',
    },
    'sortableDocketNumber.N': {
      fields: {
        keyword: {
          type: 'keyword',
        },
      },
      type: 'text',
    },
  },
};
