const {
  ENTERED_AND_SERVED_EVENT_CODES,
} = require('../entities/courtIssuedDocument/CourtIssuedDocumentConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { DocketRecord } = require('../entities/DocketRecord');
const { formatDateString } = require('../utilities/DateHandler');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');

/**
 * serveCourtIssuedDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id of the case containing the document to serve
 * @param {string} providers.documentId the document id of the signed stipulated decision document
 * @returns {object} the updated case after the document was served
 */

exports.serveCourtIssuedDocumentInteractor = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.SERVE_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized for document service');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const courtIssuedDocument = caseEntity.getDocumentById({
    documentId,
  });

  if (!courtIssuedDocument) {
    throw new NotFoundError(`Document ${documentId} was not found.`);
  }

  const docketEntry = caseEntity.docketRecord.find(
    entry => entry.documentId === documentId,
  );

  // TODO: mopve this to a helper
  const aggregateServedParties = parties => {
    const aggregated = [];
    parties.map(party => {
      if (party && party.email) {
        aggregated.push({
          email: party.email,
          name: party.name,
        });
      }
    });
    return aggregated;
  };

  // Serve on all parties
  const servedParties = aggregateServedParties([
    caseEntity.contactPrimary,
    caseEntity.contactSecondary,
    ...caseEntity.practitioners,
    ...caseEntity.respondents,
  ]);

  courtIssuedDocument.setAsServed(servedParties);

  const updatedDocketRecordEntity = new DocketRecord(docketEntry);
  updatedDocketRecordEntity.validate();

  // TODO: should the filing date be updated?
  caseEntity.updateDocketRecordEntry(updatedDocketRecordEntity);

  if (ENTERED_AND_SERVED_EVENT_CODES.includes(courtIssuedDocument.eventCode)) {
    caseEntity.closeCase();
  }

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

  // TODO: Could also be moved to a helper
  const destinations = servedParties.map(party => ({
    email: party.email,
    templateData: {
      caseCaption: caseToUpdate.caseCaption,
      docketNumber: caseToUpdate.docketNumber,
      documentName: courtIssuedDocument.documentType,
      loginUrl: `https://ui-${process.env.STAGE}.${process.env.EFCMS_DOMAIN}`,
      name: party.name,
      serviceDate: formatDateString(courtIssuedDocument.servedAt, 'MMDDYYYY'),
      serviceTime: formatDateString(courtIssuedDocument.servedAt, 'TIME'),
    },
  }));

  await applicationContext.getDispatchers().sendBulkTemplatedEmail({
    applicationContext,
    defaultTemplateData: {
      caseCaption: 'undefined',
      docketNumber: 'undefined',
      documentName: 'undefined',
      loginUrl: 'undefined',
      name: 'undefined',
      serviceDate: 'undefined',
      serviceTime: 'undefined',
    },
    destinations,
    templateName: process.env.EMAIL_SERVED_TEMPLATE,
  });

  return updatedCase;
};
