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
    contactPrimary,
    contactSecondary,
    hasIrsNotice,
    hasUploadedIrsNotice,
    irsNotices,
    originalCaseType,
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
  const caseDescription = getCaseDescription(hasIrsNotice, originalCaseType);

  let pdfFile = await applicationContext.getDocumentGenerators().petition({
    applicationContext,
    data: {
      caseCaptionExtension,
      caseDescription,
      caseTitle,
      contactPrimary,
      contactSecondary,
      hasUploadedIrsNotice,
      irsNotices: irsNotices.map(irsNotice => ({
        ...irsNotice,
        caseDescription: getCaseDescription(
          hasIrsNotice,
          irsNotice.originalCaseType,
        ),
        noticeIssuedDateFormatted: applicationContext
          .getUtilities()
          .formatDateString(irsNotice.noticeIssuedDate || '', FORMATS.MMDDYY),
      })),
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

function getCaseDescription(hasIrsNotice: boolean, caseType: string) {
  if (hasIrsNotice) {
    return CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE[caseType];
  }
  return CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE[caseType];
}
