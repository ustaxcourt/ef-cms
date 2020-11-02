/**
 * fetchPendingItems
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.judge the optional judge filter
 * @param {string} providers.docketNumber the optional docketNumber filter
 * @returns {Array} the pending items found
 */
exports.fetchPendingItems = async ({ applicationContext, judge, page }) => {
  const source = [
    'associatedJudge',
    'caseCaption',
    'docketNumber',
    'docketNumberSuffix',
    'status',
    'documentType',
    'documentTitle',
    'receivedAt',
  ];

  const pendingItemResults = await applicationContext
    .getPersistenceGateway()
    .fetchPendingItems({
      applicationContext,
      judge,
      page,
      source,
    });
  const foundDocuments = pendingItemResults.results;
  const documentsTotal = pendingItemResults.total;
  return {
    foundDocuments,
    total: documentsTotal,
  };
};
