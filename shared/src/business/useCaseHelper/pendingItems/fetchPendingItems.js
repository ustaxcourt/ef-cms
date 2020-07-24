const { Case } = require('../../entities/cases/Case');
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
    const caseDocuments = foundCase.documents || [];

    caseDocuments.forEach(document => {
      if (document.pending) {
        const pendingDocumentInfo = {
          associatedJudge: foundCase.associatedJudge,
          caseCaption: foundCase.caseCaption,
          caseId: foundCase.caseId,
          caseTitle: Case.getCaseTitle(foundCase.caseCaption),
          createdAt: document.createdAt,
          docketNumber: foundCase.docketNumber,
          docketNumberSuffix: foundCase.docketNumberSuffix,
          documentId: document.documentId,
          documentTitle: document.documentTitle,
          documentType: document.documentType,
          eventCode: document.eventCode,
          pending: document.pending,
          processingStatus: document.processingStatus,
          receivedAt: document.receivedAt,
          status: foundCase.status,
          userId: document.userId,
          workItems: document.workItems,
        };

        foundDocuments.push(pendingDocumentInfo);
      }
    });
  });

  return foundDocuments;
};
