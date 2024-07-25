import { post } from '@shared/proxies/requests';

export const generatePetitionPdfInteractor = (
  applicationContext: IApplicationContext,
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
  }: {
    //TODO: Type remaining properties
    [key: string]: any;
    hasIrsNotice: boolean;
    hasUploadedIrsNotice: boolean;
    originalCaseType: string;
  },
): Promise<{
  fileId: string;
}> => {
  return post({
    applicationContext,
    body: {
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
    },
    endpoint: '/cases/generate-petition',
  });
};
