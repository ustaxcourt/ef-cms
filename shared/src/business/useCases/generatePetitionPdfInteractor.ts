import {
  CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE,
  CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE,
} from '@shared/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

// TODO type for props

export const generatePetitionPdfInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    caseCaptionExtension,
    caseTitle,
    caseType,
    contactPrimary,
    contactSecondary,
    hasIrsNotice,
    irsNotices,
    noticeIssuedDate,
    partyType,
    petitionFacts,
    petitionReasons,
    preferredTrialCity,
    procedureType,
    taxYear,
  }: any,
): Promise<{ fileId: string }> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseDescription = hasIrsNotice
    ? CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE[caseType]
    : CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE[caseType];

  let pdfFile = await applicationContext.getDocumentGenerators().petition({
    applicationContext,
    data: {
      caseCaptionExtension,
      caseDescription,
      caseTitle,
      contactPrimary,
      contactSecondary,
      irsNotices: irsNotices.map(irsNotice => ({
        ...irsNotice,
        caseDescription: hasIrsNotice
          ? CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE[irsNotice.caseType]
          : CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE[irsNotice.caseType],
        noticeIssuedDateFormatted: applicationContext
          .getUtilities()
          .formatDateString(irsNotice.noticeIssuedDate || '', FORMATS.MMDDYY),
      })),
      noticeIssuedDate,
      partyType,
      petitionFacts,
      petitionReasons,
      preferredTrialCity,
      procedureType,
      taxYear,
    },
  });

  const fileId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: pdfFile,
    key: fileId,
  });

  return { fileId };
};
