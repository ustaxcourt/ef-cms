const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketEntry } = require('../../entities/DocketEntry');
const { NotFoundError } = require('../../../errors/errors');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber the docket number of the case to be updated
 * @param {object} providers.docketEntryMeta the docket entry metadata
 * @returns {object} the updated case after the documents are added
 */
exports.updateDocketEntryMetaInteractor = async ({
  applicationContext,
  docketEntryMeta,
  docketNumber,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.EDIT_DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized to update docket entry');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const originalDocument = caseEntity.getDocumentById({
    documentId: docketEntryMeta.documentId,
  });

  const editableFields = {
    action: docketEntryMeta.action,
    addToCoversheet: docketEntryMeta.addToCoversheet,
    additionalInfo: docketEntryMeta.additionalInfo,
    additionalInfo2: docketEntryMeta.additionalInfo2,
    attachments: docketEntryMeta.attachments,
    certificateOfService: docketEntryMeta.certificateOfService,
    certificateOfServiceDate: docketEntryMeta.certificateOfServiceDate,
    date: docketEntryMeta.date,
    description: docketEntryMeta.description,
    docketNumbers: docketEntryMeta.docketNumbers,
    documentTitle: docketEntryMeta.documentTitle,
    documentType: docketEntryMeta.documentType,
    eventCode: docketEntryMeta.eventCode,
    filingDate: docketEntryMeta.filingDate,
    freeText: docketEntryMeta.freeText,
    freeText2: docketEntryMeta.freeText2,
    hasOtherFilingParty: docketEntryMeta.hasOtherFilingParty,
    judge: docketEntryMeta.judge,
    lodged: docketEntryMeta.lodged,
    objections: docketEntryMeta.objections,
    ordinalValue: docketEntryMeta.ordinalValue,
    otherFilingParty: docketEntryMeta.otherFilingParty,
    partyIrsPractitioner: docketEntryMeta.partyIrsPractitioner,
    partyPrimary: docketEntryMeta.partyPrimary,
    partySecondary: docketEntryMeta.partySecondary,
    scenario: docketEntryMeta.scenario,
    servedAt: docketEntryMeta.servedAt,
    servedPartiesCode: docketEntryMeta.servedPartiesCode,
    serviceDate: docketEntryMeta.serviceDate,
    trialLocation: docketEntryMeta.trialLocation,
  };

  if (originalDocument) {
    const servedAtUpdated =
      editableFields.servedAt &&
      editableFields.servedAt !== originalDocument.servedAt;
    const filingDateUpdated =
      editableFields.filingDate &&
      editableFields.filingDate !== originalDocument.filingDate;
    const shouldGenerateCoversheet = servedAtUpdated || filingDateUpdated;

    const docketEntryEntity = new DocketEntry(
      {
        ...originalDocument,
        ...editableFields,
        description:
          editableFields.documentTitle ||
          editableFields.description ||
          originalDocument.description,
        filedBy: undefined, // allow constructor to re-generate
        ...caseEntity.getCaseContacts({
          contactPrimary: true,
          contactSecondary: true,
        }),
      },
      { applicationContext },
    );

    caseEntity.updateDocketEntry(docketEntryEntity);

    if (shouldGenerateCoversheet) {
      // servedAt or filingDate has changed, generate a new coversheet
      await applicationContext.getUseCases().addCoversheetInteractor({
        applicationContext,
        docketNumber: caseEntity.docketNumber,
        documentId: originalDocument.documentId,
      });
    }
  }

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
