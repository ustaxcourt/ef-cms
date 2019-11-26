const {
  aggregateElectronicallyServedParties,
} = require('../utilities/aggregateElectronicallyServedParties');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { DocketRecord } = require('../entities/DocketRecord');
const { formatDateString } = require('../utilities/DateHandler');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');

/**
 * serveSignedStipDecisionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id of the case containing the document to serve
 * @param {string} providers.documentId the document id of the signed stipulated decision document
 * @returns {object} the updated case after the document was served
 */
exports.serveSignedStipDecisionInteractor = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  applicationContext.logger.time('#--- Serving Stipulated Decision ---#');
  applicationContext.logger.info('caseId', caseId);
  applicationContext.logger.info('documentId', documentId);
  applicationContext.logger.time('Fetching the Case');

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  applicationContext.logger.timeEnd('Fetching the Case');

  const user = applicationContext.getCurrentUser();
  const dateOfService = applicationContext.getUtilities().createISODateString();

  if (!isAuthorized(user, ROLE_PERMISSIONS.SERVE_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized for document service');
  }

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }
  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const stipulatedDecisionDocument = caseEntity.getDocumentById({
    documentId,
  });

  // since this is a stip decision, we will serve all parties
  const servedParties = aggregateElectronicallyServedParties(caseEntity);

  stipulatedDecisionDocument.setAsServed(servedParties);

  // generate docket record
  const newDocketRecord = new DocketRecord({
    description: 'Stipulated Decision',
    documentId,
    filingDate: dateOfService,
    signatory: 'Entered, Judge Foley',
  });

  newDocketRecord.validate();
  caseEntity.addDocketRecord(newDocketRecord);

  // close case
  caseEntity.closeCase();

  applicationContext.logger.time('Updating the Case');

  // update case
  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

  applicationContext.logger.timeEnd('Updating the Case');

  const destinations = servedParties.map(party => ({
    email: party.email,
    templateData: {
      caseCaption: caseToUpdate.caseCaption,
      docketNumber: caseToUpdate.docketNumber,
      documentName: stipulatedDecisionDocument.documentType,
      loginUrl: `https://ui-${process.env.STAGE}.${process.env.EFCMS_DOMAIN}`,
      name: party.name,
      serviceDate: formatDateString(
        stipulatedDecisionDocument.servedAt,
        'MMDDYYYY',
      ),
      serviceTime: formatDateString(
        stipulatedDecisionDocument.servedAt,
        'TIME',
      ),
    },
  }));

  applicationContext.logger.time('Dispatching Service Email');
  applicationContext.logger.info('servedParties', servedParties);
  // email parties
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

  applicationContext.logger.timeEnd('Dispatching Service Email');

  applicationContext.logger.timeEnd('#/-- Serving Stipulated Decision --/#');
  return updatedCase;
};
