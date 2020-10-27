const { Case } = require('../../entities/cases/Case');
const { DocketEntry } = require('../../entities/DocketEntry');
const { omit, pick } = require('lodash');

/**
 * fetchPendingItems
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.judge the optional judge filter
 * @param {string} providers.docketNumber the optional docketNumber filter
 * @returns {Array} the pending items found
 */
exports.fetchPendingItems = async ({
  applicationContext,
  docketNumber,
  judge,
  page,
}) => {
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

  // TODO: refactor, these are two major different paths
  if (docketNumber) {
    const caseResult = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });
    const caseEntity = new Case(caseResult, { applicationContext });
    let foundCases = [pick(caseEntity.validate().toRawObject(), source)];
    let foundDocuments = [];

    foundCases.forEach(foundCase => {
      const foundCaseEntity = new Case(foundCase, {
        applicationContext,
      });

      foundCaseEntity.docketEntries.forEach(document => {
        if (document.pending && document.servedAt) {
          foundDocuments.push({
            ...omit(
              new DocketEntry(
                {
                  ...document,
                },
                { applicationContext },
              ).toRawObject(),
              'entityName',
            ),
            associatedJudge: foundCaseEntity.associatedJudge,
            caseCaption: foundCaseEntity.caseCaption,
            docketNumber: foundCaseEntity.docketNumber,
            docketNumberSuffix: foundCaseEntity.docketNumberSuffix,
            status: foundCaseEntity.status,
          });
        }
      });
    });

    return {
      foundDocuments,
      total: foundDocuments.length,
    };
  } else {
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
  }
};
