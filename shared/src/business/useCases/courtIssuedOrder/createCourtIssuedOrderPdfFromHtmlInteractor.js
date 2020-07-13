const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
const { UnauthorizedError } = require('../../../errors/errors');
/**
 *
 * createCourtIssuedOrderPdfFromHtmlInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id where the order is generated
 * @param {string} providers.contentHtml the html string for the pdf content
 * @param {string} providers.documentTitle the title of the document
 * @param {string} providers.signatureText (optional) text to be used as the signatory of the document
 * @returns {string} url for the generated and stored document
 */
exports.createCourtIssuedOrderPdfFromHtmlInteractor = async ({
  applicationContext,
  caseId,
  contentHtml,
  documentTitle,
  signatureText,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);
  const { docketNumberWithSuffix } = caseDetail;

  const orderPdf = await applicationContext.getDocumentGenerators().order({
    applicationContext,
    data: {
      caseCaptionExtension: caseCaptionExtension,
      caseTitle: caseTitle,
      docketNumberWithSuffix,
      orderContent: contentHtml,
      orderTitle: documentTitle,
      signatureText,
    },
  });

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    file: orderPdf,
    useTempBucket: true,
  });
};
