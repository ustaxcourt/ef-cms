import {
  CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE,
  CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE,
} from '@shared/business/entities/EntityConstants';
// import {
//   ROLE_PERMISSIONS,
//   isAuthorized,
// } from '../../../authorization/authorizationClientService';
// import { UnauthorizedError } from '@web-api/errors/errors';

// TODO type for props

export const generatePetitionPdfInteractor = async (
  applicationContext: IApplicationContext,
  {
    caseCaptionExtension,
    caseTitle,
    caseType,
    contactPrimary,
    contactSecondary,
    docketNumberWithSuffix,
    noticeIssuedDate,
    petitionFacts,
    petitionReasons,
    preferredTrialCity,
    procedureType,
    taxYear,
  }: any,
) => {
  // const user = applicationContext.getCurrentUser();

  // if (!isAuthorized(user, ROLE_PERMISSIONS.???)) {
  //   throw new UnauthorizedError('Unauthorized');
  // }
  const caseDescription =
    CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE[caseType] ||
    CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE[caseType];

  const file = await applicationContext.getDocumentGenerators().petition({
    applicationContext,
    data: {
      caseCaptionExtension,
      caseDescription,
      caseTitle,
      contactPrimary,
      contactSecondary,
      docketNumberWithSuffix,
      noticeIssuedDate,
      petitionFacts,
      petitionReasons,
      preferredTrialCity,
      procedureType,
      taxYear,
    },
  });

  // 24 hrs
  const urlTtl = 60 * 60 * 24;

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    file,
    urlTtl,
    useTempBucket: true,
  });
};
