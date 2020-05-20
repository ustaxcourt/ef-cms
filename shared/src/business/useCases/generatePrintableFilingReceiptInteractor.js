const { Case } = require('../entities/cases/Case');
const { Document } = require('../entities/Document');

/**
 * generateHtmlForFilingReceipt
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseEntity the case entity the documents were filed in
 * @param {object} providers.documents object containing the caseId and documents for the filing receipt to be generated
 * @returns {object} contentHtml, the generated HTML for the receipt; and docketNumber for the case
 */
const generateHtmlForFilingReceipt = async ({
  applicationContext,
  caseEntity,
  documents,
}) => {
  const {
    primaryDocument,
    secondaryDocument,
    secondarySupportingDocuments,
    supportingDocuments,
  } = documents;

  const formattedCaseDetail = applicationContext
    .getUtilities()
    .getFormattedCaseDetail({
      applicationContext,
      caseDetail: caseEntity,
    });

  const getDocumentContent = document => {
    const hasDocumentIncludes =
      document.attachments || document.certificateOfService;
    let content = `
      <h4>${document.documentTitle}</h4>
      ${
        hasDocumentIncludes
          ? '<h4 class="document-includes-header">Document Includes</h4>'
          : ''
      }
      ${document.attachments ? '<p class="included">Attachment(s)</p>' : ''}
      ${
        document.certificateOfService
          ? `<p class="included">Certificate of Service ${applicationContext
              .getUtilities()
              .formatDateString(
                document.certificateOfServiceDate,
                'MMDDYY',
              )}</p>`
          : ''
      }
      `;

    if (document.objections) {
      content += `
      <p>
        ${hasDocumentIncludes ? '<br />' : ''}
        ${
          ['No', 'Unknown'].includes(document.objections)
            ? `${document.objections} Objections`
            : 'Objections'
        }
      </p>
      `;
    }

    return content;
  };

  let documentsFiledContent = getDocumentContent(primaryDocument);

  if (supportingDocuments && supportingDocuments.length) {
    documentsFiledContent += '<hr />';
    supportingDocuments.forEach((supportingDocument, idx) => {
      documentsFiledContent += getDocumentContent(supportingDocument);

      if (idx < supportingDocuments.length - 1) {
        documentsFiledContent += '<hr />';
      }
    });
  }

  if (secondaryDocument) {
    documentsFiledContent += '<hr />';
    documentsFiledContent += getDocumentContent(secondaryDocument);
  }

  if (secondarySupportingDocuments && secondarySupportingDocuments.length) {
    documentsFiledContent += '<hr />';
    secondarySupportingDocuments.forEach((secondarySupportingDocument, idx) => {
      documentsFiledContent += getDocumentContent(secondarySupportingDocument);

      if (idx < secondarySupportingDocuments.length - 1) {
        documentsFiledContent += '<hr />';
      }
    });
  }

  const { caseCaption, docketNumber, docketNumberSuffix } = formattedCaseDetail;

  const contentHtml = await applicationContext
    .getTemplateGenerators()
    .generatePrintableFilingReceiptTemplate({
      applicationContext,
      content: {
        caption: caseCaption,
        docketNumberWithSuffix: docketNumber + (docketNumberSuffix || ''),
        documentsFiledContent,
        filedAt: applicationContext
          .getUtilities()
          .formatDateString(primaryDocument.receivedAt, 'DATE_TIME_TZ'),
        filedBy: primaryDocument.filedBy,
      },
    });

  return { contentHtml, docketNumber };
};

exports.generateHtmlForFilingReceipt = generateHtmlForFilingReceipt;

/**
 * generatePrintableFilingReceiptInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case the documents were filed in
 * @param {object} providers.documentsFiled object containing the caseId and documents for the filing receipt to be generated
 * @returns {string} url for the generated document on the storage client
 */
exports.generatePrintableFilingReceiptInteractor = async ({
  applicationContext,
  caseId,
  documentsFiled,
}) => {
  const caseSource = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseSource, { applicationContext }).validate();

  const getDocumentInfo = documentData => {
    const document = new Document(documentData, {
      applicationContext,
    });
    document.generateFiledBy(caseEntity);
    return {
      attachments: document.attachments,
      certificateOfService: document.certificateOfService,
      certificateOfServiceDate: document.certificateOfServiceDate,
      documentTitle: document.documentTitle,
      filedBy: document.filedBy,
      objections: document.objections,
      receivedAt: document.receivedAt,
    };
  };

  const documents = {
    primaryDocument: getDocumentInfo(documentsFiled),
    supportingDocuments: [],
  };

  if (documentsFiled.hasSupportingDocuments) {
    documents.supportingDocuments = documentsFiled.supportingDocuments.map(
      supportingDocument => getDocumentInfo(supportingDocument),
    );
  }

  if (documentsFiled.secondaryDocumentFile) {
    documents.secondaryDocument = getDocumentInfo(
      documentsFiled.secondaryDocument,
    );
  }

  if (documentsFiled.hasSecondarySupportingDocuments) {
    documents.secondarySupportingDocuments = documentsFiled.secondarySupportingDocuments.map(
      secondarySupportingDocument =>
        getDocumentInfo(secondarySupportingDocument),
    );
  }

  const { contentHtml, docketNumber } = await generateHtmlForFilingReceipt({
    applicationContext,
    caseEntity,
    documents,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml,
      docketNumber,
    });

  const documentId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: pdf,
    documentId,
    useTempBucket: true,
  });

  const {
    url,
  } = await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    documentId,
    useTempBucket: true,
  });

  return url;
};
