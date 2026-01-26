import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

/**
 * generateDraftStampOrderInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.motionDocketEntryId the docket entry id of the original motion
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.parentMessageId the id of the parent message
 * @param {boolean} providers.stampData the stamp data from the form to be applied to the stamp order pdf
 * @param {string} providers.stampedDocketEntryId the docket entry id of the new stamped order docket entry
 */
export const generateDraftStampOrderInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketNumber,
    formattedDraftDocumentTitle,
    motionDocketEntryId,
    parentMessageId,
    stampData,
    filingDateUpdated = false,
  }: {
    docketNumber: string;
    formattedDraftDocumentTitle: string;
    motionDocketEntryId: string;
    parentMessageId: string;
    stampData: any;
    filingDateUpdated?: boolean;
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
        filingDateUpdated,
      },
      authorizedUser,
    );

  return { stampedDocketEntryId: stampedDocketEntry.docketEntryId };
};
