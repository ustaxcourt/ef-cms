const { Case } = require('../../entities/cases/Case');
const { Document } = require('../../entities/Document');
const { pick } = require('lodash');

/**
 * fetchPendingItems
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.judge the optional judge filter
 * @param {string} providers.caseId the optional caseId filter
 * @returns {Array} the pending items found
 */
exports.fetchPendingItems = async ({ applicationContext, caseId, judge }) => {
  const source = [
    'associatedJudge',
    'documents',
    'caseCaption',
    'docketNumber',
    'docketNumberSuffix',
    'status',
  ];

  let foundCases;

  if (caseId) {
    const caseResult = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId,
      });
    const caseEntity = new Case(caseResult, { applicationContext });
    foundCases = [pick(caseEntity.validate().toRawObject(), source)];
  } else {
    foundCases = await applicationContext
      .getPersistenceGateway()
      .fetchPendingItems({
        applicationContext,
        judge,
        source,
      });
  }

  const foundDocuments = [];

  foundCases.forEach(foundCase => {
    const { documents = [], ...mappedProps } = foundCase;
    mappedProps.caseStatus = mappedProps.status;

    documents.forEach(document => {
      if (document.pending) {
        foundDocuments.push({
          ...new Document(
            {
              ...document,
            },
            { applicationContext },
          ).toRawObject(),
          ...mappedProps,
        });
      }
    });
  });

  return foundDocuments;
};
