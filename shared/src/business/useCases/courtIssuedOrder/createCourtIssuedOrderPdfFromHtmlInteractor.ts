import {
  CLERK_OF_THE_COURT_CONFIGURATION,
  NOTICE_EVENT_CODE,
} from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getCaseCaptionMeta } from '../../utilities/getCaseCaptionMeta';

export const createCourtIssuedOrderPdfFromHtmlInteractor = async (
  applicationContext: IApplicationContext,
  {
    addedDocketNumbers,
    contentHtml,
    docketNumber,
    documentTitle,
    eventCode,
  }: {
    contentHtml: string;
    addedDocketNumbers: string[];
    docketNumber: string;
    documentTitle: string;
    eventCode: string;
  },
): Promise<{
  fileId: string;
  url: string;
}> => {
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

  const isNoticeEvent = eventCode === NOTICE_EVENT_CODE;

  let nameOfClerk = '';
  let titleOfClerk = '';

  if (isNoticeEvent) {
    const { name, title } = await applicationContext
      .getPersistenceGateway()
      .getConfigurationItemValue({
        applicationContext,
        configurationItemKey: CLERK_OF_THE_COURT_CONFIGURATION,
      });
    nameOfClerk = name;
    titleOfClerk = title;
  }

  const orderPdf = await applicationContext.getDocumentGenerators().order({
    applicationContext,
    data: {
      addedDocketNumbers,
      caseCaptionExtension,
      caseTitle,
      docketNumberWithSuffix,
      nameOfClerk,
      orderContent: contentHtml,
      orderTitle: documentTitle,
      titleOfClerk,
    },
  });

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    file: orderPdf,
    useTempBucket: true,
  });
};
