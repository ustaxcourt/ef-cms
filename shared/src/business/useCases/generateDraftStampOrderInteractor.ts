import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const generateDraftStampOrderInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketNumber,
    formattedDraftDocumentTitle,
    motionDocketEntryId,
    parentMessageId,
    stampData,
  }: {
    docketNumber: string;
    formattedDraftDocumentTitle: string;
    motionDocketEntryId: string;
    parentMessageId: string;
    stampData: any;
  },
  authorizedUser: UnknownAuthUser,
): Promise<{ stampedDocketEntryId: string }> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.STAMP_MOTION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const stampedDocketEntry = await applicationContext
    .getUseCaseHelpers()
    .addDraftStampOrderDocketEntryInteractor(
      applicationContext,
      {
        docketNumber,
        formattedDraftDocumentTitle,
        originalDocketEntryId: motionDocketEntryId,
        parentMessageId,
        stampData,
      },
      authorizedUser,
    );

  await applicationContext
    .getUseCaseHelpers()
    .generateStampedCoversheetInteractor(
      applicationContext,
      {
        docketEntryId: motionDocketEntryId,
        docketNumber,
        stampData,
        stampedDocumentStorageId: stampedDocketEntry.documentStorageId,
      },
      authorizedUser,
    );

  return { stampedDocketEntryId: stampedDocketEntry.docketEntryId };
};
