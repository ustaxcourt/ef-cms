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

  const {
    associatedJudge,
    caseCaption,
    docketEntries,
    docketNumberSuffix,
    status,
  } = new Case(caseResult, { applicationContext });
  let foundDocuments = [];

  docketEntries.forEach(docketEntry => {
    if (DocketEntry.isPending(docketEntry)) {
      foundDocuments.push({
        ...omit(
          new DocketEntry(
            {
              ...docketEntry,
            },
            { applicationContext },
          ).toRawObject(),
          'entityName',
        ),
        associatedJudge,
        caseCaption,
        docketNumber,
        docketNumberSuffix,
        status,
      });
    }
  });

  return foundDocuments;
};
