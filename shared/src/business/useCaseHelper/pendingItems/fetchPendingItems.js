const { Case } = require('../../entities/cases/Case');
const { Document } = require('../../entities/Document');
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
}) => {
  const source = [
    'associatedJudge',
    'documents',
    'caseCaption',
    'docketNumber',
    'docketNumberSuffix',
    'status',
  ];

  let foundCases;

  if (docketNumber) {
    const caseResult = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
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
    const foundCaseEntity = new Case(foundCase, {
      applicationContext,
    });

    foundCaseEntity.documents.forEach(document => {
      if (document.pending) {
        foundDocuments.push({
          ...omit(
            new Document(
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

  return foundDocuments;
};
