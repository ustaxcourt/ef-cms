const {
  aggregatePartiesForService,
} = require('../utilities/aggregatePartiesForService');
const {
  copyToNewPdf,
  getAddressPages,
} = require('../useCaseHelper/service/appendPaperServiceAddressPageToPdf');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { addCoverToPdf } = require('./addCoversheetInteractor');
const { Case } = require('../entities/cases/Case');
const { Document } = require('../entities/Document');
const { PDFDocument } = require('pdf-lib');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * updatePetitionerInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {object} providers.contactPrimary the primary contact information to update on the case
 * @param {object} providers.contactSecondary the secondary contact information to update on the case
 * @param {object} providers.partyType the party type to update on the case
 * @returns {object} the updated case data
 */
exports.updatePetitionerInformationInteractor = async ({
  applicationContext,
  caseId,
  contactPrimary,
  contactSecondary,
  partyType,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.EDIT_PETITION_DETAILS)) {
    throw new UnauthorizedError('Unauthorized for editing petition details');
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId });

  const primaryChange = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({
      newData: contactPrimary,
      oldData: oldCase.contactPrimary,
    });

  const secondaryChange =
    contactSecondary &&
    contactSecondary.name &&
    oldCase.contactSecondary &&
    oldCase.contactSecondary.name
      ? applicationContext.getUtilities().getDocumentTypeForAddressChange({
          newData: contactSecondary,
          oldData: oldCase.contactSecondary || {},
        })
      : undefined;

  const caseEntity = new Case(
    {
      ...oldCase,
      contactPrimary,
      contactSecondary,
      partyType,
    },
    { applicationContext },
  );

  const caseDetail = {
    ...caseEntity.validate().toRawObject(),
    caseCaptionPostfix: Case.CASE_CAPTION_POSTFIX,
  };

  const servedParties = aggregatePartiesForService(caseEntity);

  const createDocumentForChange = async ({
    contactName,
    documentType,
    newData,
    oldData,
  }) => {
    const pdfContentHtml = await applicationContext
      .getTemplateGenerators()
      .generateChangeOfAddressTemplate({
        applicationContext,
        content: {
          caption: caseDetail.caseCaption,
          captionPostfix: caseDetail.caseCaptionPostfix,
          docketNumberWithSuffix: `${caseDetail.docketNumber}${
            caseDetail.docketNumberSuffix || ''
          }`,
          documentTitle: documentType.title,
          name: contactName,
          newData,
          oldData,
        },
      });

    const newDocumentId = applicationContext.getUniqueId();

    const changeOfAddressDocument = new Document(
      {
        addToCoversheet: true,
        additionalInfo: `for ${contactName}`,
        caseId,
        documentId: newDocumentId,
        documentTitle: documentType.title,
        documentType: documentType.title,
        eventCode: documentType.eventCode,
        processingStatus: 'complete',
        userId: user.userId,
      },
      { applicationContext },
    );
    changeOfAddressDocument.setAsServed(servedParties.all);

    const changeOfAddressPdf = await applicationContext
      .getUseCases()
      .generatePdfFromHtmlInteractor({
        applicationContext,
        contentHtml: pdfContentHtml,
        displayHeaderFooter: false,
        docketNumber: caseEntity.docketNumber,
        headerHtml: null,
      });

    const changeOfAddressPdfWithCover = await addCoverToPdf({
      applicationContext,
      caseEntity,
      documentEntity: changeOfAddressDocument,
      pdfData: changeOfAddressPdf,
    });

    caseEntity.addDocument(changeOfAddressDocument, { applicationContext });

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: changeOfAddressPdfWithCover,
      documentId: newDocumentId,
    });

    await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      documentEntity: changeOfAddressDocument,
      servedParties,
    });

    return changeOfAddressPdfWithCover;
  };

  let primaryPdf;
  let secondaryPdf;
  let paperServicePdfUrl;
  if (primaryChange) {
    primaryPdf = await createDocumentForChange({
      contactName: contactPrimary.name,
      documentType: primaryChange,
      newData: contactPrimary,
      oldData: oldCase.contactPrimary,
    });
  }
  if (secondaryChange) {
    secondaryPdf = await createDocumentForChange({
      contactName: contactSecondary.name,
      documentType: secondaryChange,
      newData: contactSecondary,
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
        newPdfDoc: fullDocument,
        noticeDoc: await PDFDocument.load(primaryPdf),
      });
    }
    if (secondaryPdf) {
      await copyToNewPdf({
        addressPages,
        newPdfDoc: fullDocument,
        noticeDoc: await PDFDocument.load(secondaryPdf),
      });
    }

    const paperServicePdfData = await fullDocument.save();
    const paperServicePdfId = applicationContext.getUniqueId();
    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: paperServicePdfData,
      documentId: paperServicePdfId,
      useTempBucket: true,
    });

    const {
      url,
    } = await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
      applicationContext,
      documentId: paperServicePdfId,
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
    paperServiceParties: servedParties && servedParties.paper,
    paperServicePdfUrl,
    updatedCase,
  };
};
