const {
  aggregatePartiesForService,
} = require('../utilities/aggregatePartiesForService');
const {
  copyToNewPdf,
  getAddressPages,
} = require('../useCaseHelper/service/appendPaperServiceAddressPageToPdf');
const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} = require('../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { addCoverToPdf } = require('./addCoversheetInteractor');
const { Case } = require('../entities/cases/Case');
const { DocketEntry } = require('../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../utilities/getCaseCaptionMeta');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * updatePetitionerInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.contactPrimary the primary contact information to update on the case
 * @param {object} providers.contactSecondary the secondary contact information to update on the case
 * @param {object} providers.partyType the party type to update on the case
 * @returns {object} the updated case data
 */
exports.updatePetitionerInformationInteractor = async ({
  applicationContext,
  contactPrimary,
  contactSecondary,
  docketNumber,
  partyType,
}) => {
  const { PDFDocument } = await applicationContext.getPdfLib();

  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.EDIT_PETITION_DETAILS)) {
    throw new UnauthorizedError('Unauthorized for editing petition details');
  }

  const primaryEditableFields = {
    address1: contactPrimary.address1,
    address2: contactPrimary.address2,
    address3: contactPrimary.address3,
    city: contactPrimary.city,
    country: contactPrimary.country,
    countryType: contactPrimary.countryType,
    inCareOf: contactPrimary.inCareOf,
    name: contactPrimary.name,
    phone: contactPrimary.phone,
    postalCode: contactPrimary.postalCode,
    secondaryName: contactPrimary.secondaryName,
    serviceIndicator: contactPrimary.serviceIndicator,
    state: contactPrimary.state,
    title: contactPrimary.title,
  };
  let secondaryEditableFields;
  if (contactSecondary) {
    secondaryEditableFields = {
      address1: contactSecondary.address1,
      address2: contactSecondary.address2,
      address3: contactSecondary.address3,
      city: contactSecondary.city,
      country: contactSecondary.country,
      countryType: contactSecondary.countryType,
      inCareOf: contactPrimary.inCareOf,
      name: contactSecondary.name,
      phone: contactSecondary.phone,
      postalCode: contactSecondary.postalCode,
      serviceIndicator: contactSecondary.serviceIndicator,
      state: contactSecondary.state,
    };
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const primaryChange = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({
      newData: primaryEditableFields,
      oldData: oldCase.contactPrimary,
    });

  const secondaryChange =
    secondaryEditableFields &&
    secondaryEditableFields.name &&
    oldCase.contactSecondary &&
    oldCase.contactSecondary.name
      ? applicationContext.getUtilities().getDocumentTypeForAddressChange({
          newData: secondaryEditableFields,
          oldData: oldCase.contactSecondary,
        })
      : undefined;

  const caseEntity = new Case(
    {
      ...oldCase,
      contactPrimary: {
        ...oldCase.contactPrimary,
        ...primaryEditableFields,
      },
      contactSecondary: {
        ...oldCase.contactSecondary,
        ...secondaryEditableFields,
      },
      partyType,
    },
    { applicationContext },
  );

  const caseDetail = caseEntity.validate().toRawObject();

  const servedParties = aggregatePartiesForService(caseEntity);

  const createDocketEntryForChange = async ({
    contactName,
    documentType,
    newData,
    oldData,
  }) => {
    const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

    const changeOfAddressPdf = await applicationContext
      .getDocumentGenerators()
      .changeOfAddress({
        applicationContext,
        content: {
          caseCaptionExtension,
          caseTitle,
          docketNumber: caseEntity.docketNumber,
          docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
          documentTitle: documentType.title,
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
      },
      { applicationContext },
    );
    changeOfAddressDocketEntry.setAsServed(servedParties.all);

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

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: changeOfAddressPdfWithCover,
      key: newDocketEntryId,
    });

    await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      docketEntryEntity: changeOfAddressDocketEntry,
      servedParties,
    });

    return changeOfAddressPdfWithCover;
  };

  let primaryPdf;
  let secondaryPdf;
  let paperServicePdfUrl;
  if (primaryChange) {
    primaryPdf = await createDocketEntryForChange({
      contactName: primaryEditableFields.name,
      documentType: primaryChange,
      newData: primaryEditableFields,
      oldData: oldCase.contactPrimary,
    });
  }
  if (secondaryChange) {
    secondaryPdf = await createDocketEntryForChange({
      contactName: secondaryEditableFields.name,
      documentType: secondaryChange,
      newData: secondaryEditableFields,
      oldData: oldCase.contactSecondary || {},
    });
  }

  if ((primaryChange || secondaryChange) && servedParties.paper.length > 0) {
    const fullDocument = await PDFDocument.create();

    const addressPages = await getAddressPages({
      applicationContext,
      caseEntity,
      servedParties,
    });

    if (primaryPdf) {
      await copyToNewPdf({
        addressPages,
        applicationContext,
        newPdfDoc: fullDocument,
        noticeDoc: await PDFDocument.load(primaryPdf),
      });
    }
    if (secondaryPdf) {
      await copyToNewPdf({
        addressPages,
        applicationContext,
        newPdfDoc: fullDocument,
        noticeDoc: await PDFDocument.load(secondaryPdf),
      });
    }

    const paperServicePdfData = await fullDocument.save();
    const paperServicePdfId = applicationContext.getUniqueId();
    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: paperServicePdfData,
      key: paperServicePdfId,
      useTempBucket: true,
    });

    const {
      url,
    } = await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
      applicationContext,
      key: paperServicePdfId,
      useTempBucket: true,
    });

    paperServicePdfUrl = url;
  }

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

  return {
    paperServiceParties: servedParties.paper,
    paperServicePdfUrl,
    updatedCase,
  };
};
