import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getCaseCaptionMeta } from '../../utilities/getCaseCaptionMeta';

/**
 *
 * createCourtIssuedOrderPdfFromHtmlInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case where the order is generated
 * @param {string} providers.contentHtml the html string for the pdf content
 * @param {string} providers.documentTitle the title of the document
 * @param {string} providers.signatureText (optional) text to be used as the signatory of the document
 * @returns {string} url for the generated and stored document
 */
export const createCourtIssuedOrderPdfFromHtmlInteractor = async (
  applicationContext: IApplicationContext,
  {
    addedDocketNumbers,
    contentHtml,
    docketNumber,
    documentTitle,
    signatureText,
  }: {
    contentHtml: string;
    addedDocketNumbers: string[];
    docketNumber: string;
    documentTitle: string;
    signatureText: string;
  },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);
  const { docketNumberWithSuffix } = caseDetail;

  const orderPdf = await applicationContext.getDocumentGenerators().order({
    applicationContext,
    data: {
      addedDocketNumbers,
      caseCaptionExtension,
      caseTitle,
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
