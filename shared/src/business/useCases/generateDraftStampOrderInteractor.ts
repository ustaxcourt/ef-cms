import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

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
    stampedDocketEntryId,
  }: {
    docketNumber: string;
    formattedDraftDocumentTitle: string;
    motionDocketEntryId: string;
    parentMessageId: string;
    stampData: any;
    stampedDocketEntryId: string;
  },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.STAMP_MOTION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  await applicationContext
    .getUseCaseHelpers()
    .addDraftStampOrderDocketEntryInteractor(applicationContext, {
      docketNumber,
      formattedDraftDocumentTitle,
      originalDocketEntryId: motionDocketEntryId,
      parentMessageId,
      stampData,
      stampedDocketEntryId,
    });

  await applicationContext
    .getUseCaseHelpers()
    .generateStampedCoversheetInteractor(applicationContext, {
      docketEntryId: motionDocketEntryId,
      docketNumber,
      stampData,
      stampedDocketEntryId,
    });
};
