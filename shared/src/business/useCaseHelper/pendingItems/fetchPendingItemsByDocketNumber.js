const { Case } = require('../../entities/cases/Case');
const { DocketEntry } = require('../../entities/DocketEntry');
const { omit } = require('lodash');

/**
 * fetchPendingItemsByDocketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the optional docketNumber filter
 * @returns {Array} the pending items found
 */
exports.fetchPendingItemsByDocketNumber = async ({
  applicationContext,
  docketNumber,
}) => {
  const caseResult = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseResult, { applicationContext });
  let foundDocuments = [];

  caseEntity.docketEntries.forEach(document => {
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
        associatedJudge: caseEntity.associatedJudge,
        caseCaption: caseEntity.caseCaption,
        docketNumber: caseEntity.docketNumber,
        docketNumberSuffix: caseEntity.docketNumberSuffix,
        status: caseEntity.status,
      });
    }
  });

  return foundDocuments;
};
