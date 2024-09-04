import {
  IrsNotice,
  PetitionPdfBase,
} from '@shared/business/useCases/generatePetitionPdfInteractor';
import { post } from '@shared/proxies/requests';

export const generatePetitionPdfInteractor = (
  applicationContext,
  {
    caseCaptionExtension,
    caseTitle,
    contactCounsel,
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
  }: PetitionPdfBase & {
    hasIrsNotice: boolean;
    originalCaseType: string;
    irsNotices: IrsNotice[];
  },
): Promise<{
  fileId: string;
}> => {
  return post({
    applicationContext,
    body: {
      caseCaptionExtension,
      caseTitle,
      contactCounsel,
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
    },
    endpoint: '/cases/generate-petition',
  });
};
