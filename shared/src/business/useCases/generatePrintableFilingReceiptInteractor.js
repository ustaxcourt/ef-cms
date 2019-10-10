/**
 * generatePrintableFilingReceiptInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id for the filing receipt to be generated
 * @returns {Uint8Array} filing receipt pdf
 */
exports.generatePrintableFilingReceiptInteractor = async ({
  applicationContext,
  documents,
}) => {
  const { caseId, primaryDocument, supportingDocuments } = documents;
  const { Case } = applicationContext.getEntityConstructors();
  const caseCaptionPostfix = Case.CASE_CAPTION_POSTFIX;

  const caseSource = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseSource, { applicationContext });
  const formattedCaseDetail = applicationContext
    .getUtilities()
    .getFormattedCaseDetail({
      applicationContext,
      caseDetail: caseEntity,
    });
  formattedCaseDetail.showCaseNameForPrimary = caseEntity.getShowCaseNameForPrimary();

  const getDocumentContent = document => {
    let content = `
      <h4>${document.documentTitle}</h4>
      <h4>Document Includes</h4>
      ${document.attachments ? '<p>Attachment(s)</p>' : ''}
      ${
        document.certificateOfService
          ? `<p>Certificate of Service ${applicationContext
              .getUtilities()
              .formatDateString(
                document.certificateOfServiceDate,
                'MMDDYY',
              )}</p>`
          : ''
      }
      <p>
        <br />
        ${
          document.objections && document.objections === true
            ? 'Objections'
            : 'No Objections'
        }
      </p>
      `;

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

  const { caseCaption, docketNumber, docketNumberSuffix } = formattedCaseDetail;

  const contentHtml = await applicationContext
    .getTemplateGenerators()
    .generatePrintableFilingReceiptTemplate({
      caption: caseCaption,
      captionPostfix: caseCaptionPostfix,
      docketNumberWithSuffix: docketNumber + (docketNumberSuffix || ''),
      documentsFiledContent,
      filedAt: applicationContext
        .getUtilities()
        .formatDateString(new Date(), 'DATE_TIME_TZ'),
    });

  return await applicationContext.getUseCases().generatePdfFromHtmlInteractor({
    applicationContext,
    contentHtml,
    docketNumber,
  });
};
