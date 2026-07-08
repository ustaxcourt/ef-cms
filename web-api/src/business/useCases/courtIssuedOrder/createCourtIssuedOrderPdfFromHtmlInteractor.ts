import { NOTICE_EVENT_CODE } from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getClerkOfTheCourtInfo } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValue';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { sanitizeUserHtml } from '@shared/business/utilities/sanitizeUserHtml';

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

  const caseDetail = await getCaseByDocketNumber({
    docketNumber,
  });

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);
  const { docketNumberWithSuffix } = caseDetail;

  const isNoticeEvent = eventCode === NOTICE_EVENT_CODE;

  let nameOfClerk = '';
  let titleOfClerk = '';

  if (isNoticeEvent) {
    const { name, title } = await getClerkOfTheCourtInfo();
    nameOfClerk = name;
    titleOfClerk = title;
  }

  const sanitizedOrderContent = sanitizeUserHtml(contentHtml);

  const orderPdf = await applicationContext.getDocumentGenerators().order({
    applicationContext,
    data: {
      addedDocketNumbers: addedDocketNumbers.sort((a, b) =>
        Case.docketNumberSort(a, b),
      ),
      caseCaptionExtension,
      caseTitle,
      docketNumberWithSuffix: docketNumberWithSuffix || docketNumber,
      nameOfClerk,
      orderContent: sanitizedOrderContent,
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
