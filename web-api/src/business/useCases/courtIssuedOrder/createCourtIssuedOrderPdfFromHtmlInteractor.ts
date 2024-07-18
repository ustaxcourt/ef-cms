import {
  CLERK_OF_THE_COURT_CONFIGURATION,
  NOTICE_EVENT_CODE,
} from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseCaptionMeta } from '../../../../../shared/src/business/utilities/getCaseCaptionMeta';

export const createCourtIssuedOrderPdfFromHtmlInteractor = async (
  applicationContext: ServerApplicationContext,
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
  authorizedUser: UnknownAuthUser,
): Promise<{
  fileId: string;
  url: string;
}> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT)) {
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
      // TODO 10417: docketNumberwithSuffix should be properly typed
      // @ts-ignore
      docketNumberWithSuffix,
      nameOfClerk,
      orderContent: contentHtml,
      orderTitle: documentTitle,
      titleOfClerk,
    },
  });

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    // TODO 10417: file should be properly typed
    // @ts-ignore
    file: orderPdf,
    useTempBucket: true,
  });
};
