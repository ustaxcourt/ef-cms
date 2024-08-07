import {
  CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE,
  CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE,
} from '@shared/business/entities/EntityConstants';
import { CreateCaseIrsForm } from '@web-client/presenter/state';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export type IrsNotice = CreateCaseIrsForm & {
  noticeIssuedDateFormatted: string;
  originalCaseType: string;
};

export type IrsNoticesWithCaseDescription = IrsNotice & {
  caseDescription: string;
};

export interface Contact {
  countryType: string;
  name: string;
  inCareOf?: string;
  secondaryName?: string;
  title?: string;
  country: string;
  address1: string;
  address2?: string;
  address3?: string;
  city: string;
  postalCode: string;
  phone: string;
  state: string;
  placeOfLegalResidence?: string;
  contactType: 'primary' | 'secondary';
  email: string;
}

export type ContactSecondary = Contact & {
  hasConsentedToEService?: boolean;
  phone?: string;
  paperPetitionEmail?: string;
};

export interface PetitionPdfBase {
  caseCaptionExtension: string;
  caseTitle: string;
  contactPrimary: Contact;
  contactSecondary?: ContactSecondary;
  hasUploadedIrsNotice: boolean;
  partyType: string;
  petitionFacts: string[];
  petitionReasons: string[];
  preferredTrialCity: string;
  procedureType: string;
}

export const generatePetitionPdfInteractor = async (
  applicationContext,
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
  }: PetitionPdfBase & {
    hasIrsNotice: boolean;
    originalCaseType: string;
    irsNotices: IrsNotice[];
  },
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
      })),
      partyType,
      petitionFacts,
      petitionReasons,
      preferredTrialCity,
      procedureType,
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
