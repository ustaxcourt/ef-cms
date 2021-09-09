const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { addCoverToPdf } = require('../../useCases/addCoversheetInteractor');
const { Case } = require('../../entities/cases/Case');
const { DOCKET_SECTION } = require('../../entities/EntityConstants');
const { DocketEntry } = require('../../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');

const { WorkItem } = require('../../entities/WorkItem');

/**
 * This function isolates task of generating the Docket Entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseEntity the instantiated Case class (updated by reference)
 * @param {object} providers.documentType the document type of the document being created
 * @param {object} providers.newData the new practitioner contact information
 * @param {object} providers.oldData the old practitioner contact information (for comparison)
 * @param {object} providers.practitionerName the name of the practitioner
 * @param {object} providers.user the user object that includes userId, barNumber etc.
 * @returns {Promise<User[]>} the internal users
 */
const createDocketEntryForChange = async ({
  applicationContext,
  caseEntity,
  contactName,
  documentType,
  docketMeta = {},
  newData,
  oldData,
  servedParties,
  user,
}) => {
  const caseDetail = caseEntity.validate().toRawObject();
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);
  if (!contactName) {
    ({ contactName } = newData);
  }

  const changeOfAddressPdf = await applicationContext
    .getDocumentGenerators()
    .changeOfAddress({
      applicationContext,
      content: {
        caseCaptionExtension,
        caseTitle,
        docketNumber: caseEntity.docketNumber,
        docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
        documentType,
        name: contactName,
        newData,
        oldData,
      },
    });

  const newDocketEntryId = applicationContext.getUniqueId();

  const changeOfAddressDocketEntry = new DocketEntry(
    {
      addToCoversheet: true,
      additionalInfo: `for ${contactName}`,
      docketEntryId: newDocketEntryId,
      docketNumber: caseEntity.docketNumber,
      documentTitle: documentType.title,
      documentType: documentType.title,
      eventCode: documentType.eventCode,
      isAutoGenerated: true,
      isFileAttached: true,
      isOnDocketRecord: true,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      userId: user.userId,
      ...docketMeta,
    },
    { applicationContext },
  );

  const { pdfData: changeOfAddressPdfWithCover } = await addCoverToPdf({
    applicationContext,
    caseEntity,
    docketEntryEntity: changeOfAddressDocketEntry,
    pdfData: changeOfAddressPdf,
  });

  changeOfAddressDocketEntry.numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      documentBytes: changeOfAddressPdfWithCover,
    });

  caseEntity.addDocketEntry(changeOfAddressDocketEntry);
  changeOfAddressDocketEntry.setAsServed(servedParties.all);

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: changeOfAddressPdfWithCover,
    key: newDocketEntryId,
  });

  return {
    changeOfAddressDocketEntry,
    changeOfAddressPdfWithCover,
    servedParties,
  };
};

const createWorkItemForChange = async ({
  applicationContext,
  caseEntity,
  changeOfAddressDocketEntry,
  user,
}) => {
  const workItem = new WorkItem(
    {
      assigneeId: null,
      assigneeName: null,
      associatedJudge: caseEntity.associatedJudge,
      caseIsInProgress: caseEntity.inProgress,
      caseStatus: caseEntity.status,
      caseTitle: Case.getCaseTitle(caseEntity.caseCaption),
      docketEntry: {
        ...changeOfAddressDocketEntry.toRawObject(),
        createdAt: changeOfAddressDocketEntry.createdAt,
      },
      docketNumber: caseEntity.docketNumber,
      docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
      section: DOCKET_SECTION,
      sentBy: user.name,
      sentByUserId: user.userId,
    },
    { applicationContext },
  );

  changeOfAddressDocketEntry.setWorkItem(workItem);

  await applicationContext.getPersistenceGateway().saveWorkItem({
    applicationContext,
    workItem: workItem.validate().toRawObject(),
  });
};

const createDocketEntryAndWorkItem = async ({
  applicationContext,
  caseEntity,
  docketMeta,
  documentType,
  newData,
  oldData,
  partyWithPaperService,
  privatePractitionersRepresentingContact,
  servedParties,
  user,
}) => {
  const changeDocs = await createDocketEntryForChange({
    applicationContext,
    caseEntity,
    contactName: newData.name,
    docketMeta,
    documentType,
    newData,
    oldData,
    servedParties,
    user,
  });

  if (!privatePractitionersRepresentingContact || partyWithPaperService) {
    await createWorkItemForChange({
      applicationContext,
      caseEntity,
      changeOfAddressDocketEntry: changeDocs.changeOfAddressDocketEntry,
      user,
    });
  }
  return changeDocs;
};

const generateAndServeDocketEntry = async ({
  applicationContext,
  caseEntity,
  contactName,
  docketMeta,
  documentType,
  newData,
  oldData,
  privatePractitionersRepresentingContact,
  servedParties,
  user,
}) => {
  const petitionerHasPaperService = caseEntity.petitioners.some(
    p => p.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER,
  );
  const paperServiceRequested =
    petitionerHasPaperService ||
    user.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER;

  let changeOfAddressDocketEntry;

  if (paperServiceRequested) {
    ({ changeOfAddressDocketEntry } = await createDocketEntryAndWorkItem({
      applicationContext,
      caseEntity,
      docketMeta,
      documentType,
      newData,
      oldCaseContact: oldData,
      partyWithPaperService: petitionerHasPaperService,
      privatePractitionersRepresentingContact,
      servedParties,
      user,
    }));
  } else {
    ({ changeOfAddressDocketEntry } = await createDocketEntryForChange({
      applicationContext,
      caseEntity,
      contactName,
      docketMeta,
      documentType,
      newData,
      oldData,
      servedParties,
      user,
    }));
  }
  await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    docketEntryId: changeOfAddressDocketEntry.docketEntryId,
    servedParties,
  });

  return { caseEntity, changeOfAddressDocketEntry };
};

module.exports = {
  createDocketEntryAndWorkItem,
  createDocketEntryForChange,
  createWorkItemForChange,
  generateAndServeDocketEntry,
};
