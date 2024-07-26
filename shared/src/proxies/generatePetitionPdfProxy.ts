import { post } from '@shared/proxies/requests';

export const generatePetitionPdfInteractor = (
  applicationContext: IApplicationContext,
  {
    caseCaptionExtension,
    caseDescription,
    caseTitle,
    contactPrimary,
    contactSecondary,
    hasIrsNotice,
    hasUploadedIrsNotice,
    irsNotices,
    partyType,
    petitionFacts,
    petitionReasons,
    preferredTrialCity,
    procedureType,
    taxYear,
  }: {
    //TODO: Type remaining properties
    [key: string]: any;
    caseDescription: string;
    hasIrsNotice: boolean;
    hasUploadedIrsNotice: boolean;
  },
): Promise<{
  fileId: string;
}> => {
  return post({
    applicationContext,
    body: {
      caseCaptionExtension,
      caseDescription,
      caseTitle,
      contactPrimary,
      contactSecondary,
      hasIrsNotice,
      hasUploadedIrsNotice,
      irsNotices,
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
