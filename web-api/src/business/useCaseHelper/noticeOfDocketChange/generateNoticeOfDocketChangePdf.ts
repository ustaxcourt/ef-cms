import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

export const generateNoticeOfDocketChangePdf = async ({
  applicationContext,
  docketChangeInfo,
}: {
  applicationContext: ServerApplicationContext;
  docketChangeInfo: {
    caseCaptionExtension: string;
    caseTitle: string;
    docketEntryIndex: string;
    docketNumber: string;
    titleOfClerk: string;
    nameOfClerk: string;
    filingParties: { after: string | undefined; before: string | undefined };
    filingsAndProceedings: { after: string; before: string };
  };
}): Promise<string> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPLOAD_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const {
    caseCaptionExtension,
    caseTitle,
    docketEntryIndex,
    docketNumber,
    filingParties,
    filingsAndProceedings,
    nameOfClerk,
    titleOfClerk,
  } = docketChangeInfo;

  const noticePdf = await applicationContext
    .getDocumentGenerators()
    .noticeOfDocketChange({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketEntryIndex,
        docketNumberWithSuffix: docketNumber,
        filingParties,
        filingsAndProceedings,
        nameOfClerk,
        titleOfClerk,
      },
    });

  const docketEntryId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().uploadDocument({
    applicationContext,
    pdfData: noticePdf,
    pdfName: docketEntryId,
  });

  return docketEntryId;
};
