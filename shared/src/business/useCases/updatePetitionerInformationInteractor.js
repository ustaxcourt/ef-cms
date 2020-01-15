const {
  aggregatePartiesForService,
} = require('../utilities/aggregatePartiesForService');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const {
  sendServedPartiesEmails,
} = require('../utilities/sendServedPartiesEmails');
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
    contactSecondary && contactSecondary.name
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
          docketNumberWithSuffix: `${
            caseDetail.docketNumber
          }${caseDetail.docketNumberSuffix || ''}`,
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
        documentType: documentType.title,
        eventCode: documentType.eventCode,
        filedBy: user.name,
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

    caseEntity.addDocument(changeOfAddressDocument);

    await applicationContext.getPersistenceGateway().saveDocument({
      applicationContext,
      document: changeOfAddressPdfWithCover,
      documentId: newDocumentId,
    });

    await sendServedPartiesEmails({
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

  if (servedParties.paper.length > 0) {
    const fullDocument = await PDFDocument.create();

    const addressPages = [];
    for (let party of servedParties.paper) {
      addressPages.push(
        await applicationContext
          .getUseCaseHelpers()
          .generatePaperServiceAddressPagePdf({
            applicationContext,
            contactData: party,
            docketNumberWithSuffix: `${
              caseEntity.docketNumber
            }${caseEntity.docketNumberSuffix || ''}`,
          }),
      );
    }

    const addAddressPageAndNoticeToDocument = async ({
      addressPagesToAdd,
      combinedDocument,
      documentToAdd,
    }) => {
      const documentToAddPdf = await PDFDocument.load(documentToAdd);
      for (let addressPage of addressPagesToAdd) {
        const addressPageDoc = await PDFDocument.load(addressPage);
        let copiedPages = await combinedDocument.copyPages(
          addressPageDoc,
          addressPageDoc.getPageIndices(),
        );
        copiedPages.forEach(page => {
          combinedDocument.addPage(page);
        });

        copiedPages = await combinedDocument.copyPages(
          documentToAddPdf,
          documentToAddPdf.getPageIndices(),
        );
        copiedPages.forEach(page => {
          combinedDocument.addPage(page);
        });
      }
    };

    if (primaryPdf) {
      await addAddressPageAndNoticeToDocument({
        addressPagesToAdd: addressPages,
        combinedDocument: fullDocument,
        documentToAdd: primaryPdf,
      });
    }
    if (secondaryPdf) {
      await addAddressPageAndNoticeToDocument({
        addressPagesToAdd: addressPages,
        combinedDocument: fullDocument,
        documentToAdd: secondaryPdf,
      });
    }

    const paperServicePdfData = await fullDocument.save();
    const paperServicePdfId = applicationContext.getUniqueId();
    applicationContext.logger.time('Saving S3 Document');
    await applicationContext.getPersistenceGateway().saveDocument({
      applicationContext,
      document: paperServicePdfData,
      documentId: paperServicePdfId,
      useTempBucket: true,
    });
    applicationContext.logger.timeEnd('Saving S3 Document');

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
