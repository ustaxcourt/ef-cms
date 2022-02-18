exports.getSealedQuery = ({ caseQueryParams, documentMustNotQuery }) => {
  documentMustNotQuery.push({
    term: { 'isSealed.BOOL': true },
  });

  documentMustNotQuery.push({
    term: { 'sealedTo.S': 'External' },
  });

  caseQueryParams.has_parent.query.bool.filter.push({
    bool: {
      must: [
        {
          bool: {
            minimum_should_match: 1,
            should: [
              {
                bool: {
                  must: {
                    term: { 'isSealed.BOOL': false },
                  },
                },
              },
              {
                bool: {
                  must_not: {
                    exists: { field: 'isSealed' },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  });
};
