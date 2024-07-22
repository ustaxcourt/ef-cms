import { post } from '@shared/proxies/requests';

export const generatePetitionPdfInteractor = (
  applicationContext: IApplicationContext,
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
  }: {
    [key: string]: any;
    hasIrsNotice: boolean;
  },
): Promise<{
  fileId: string;
}> => {
  return post({
    applicationContext,
    body: {
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
    },
    endpoint: '/cases/generate-petition',
  });
};
