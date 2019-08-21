const { Case } = require('../entities/cases/Case');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { DocketRecord } = require('../entities/DocketRecord');
const { Document } = require('../entities/Document');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');

/**
 * updatePrimaryContactInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update the primary contact
 * @param {object} providers.contactInfo the contact info to update on the case
 * @returns {object} the updated case
 */
exports.updatePrimaryContactInteractor = async ({
  applicationContext,
  caseId,
  contactInfo,
  pdfContentHtml,
}) => {
  const user = applicationContext.getCurrentUser();

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  if (user.userId !== caseToUpdate.userId) {
    throw new UnauthorizedError('Unauthorized for update case contact');
  }

  caseToUpdate.contactPrimary = ContactFactory.createContacts({
    contactInfo: { primary: contactInfo },
    partyType: caseToUpdate.partyType,
  }).primary.toRawObject();

  const caseEntity = new Case(caseToUpdate);

  // generate pdf
  const docketRecordPdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      displayHeaderFooter: false,
      docketNumber: caseToUpdate.docketNumber,
      headerHtml: null,
      pdfContentHtml,
    });

  // upload document

  // attach document to docket entry

  caseEntity.addDocketRecord(
    new DocketRecord({
      description: `Notice of Change of Address by ${user.name}`,
      filingDate: applicationContext.getUtilities().createISODateString(),
    }),
  );

  const rawCase = caseEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: rawCase,
  });

  return rawCase;
};
