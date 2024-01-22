import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export type FilePetitionFromPaperTypeDetailsType = {
  attachmentToPetitionFile?: Blob;
  applicationForWaiverOfFilingFeeFile?: Blob;
  applicationForWaiverOfFilingFeeUploadProgress?: string;
  atpUploadProgress?: string;
  corporateDisclosureFile?: Blob;
  corporateDisclosureUploadProgress?: string;
  petitionFile: Blob;
  petitionMetadata: CaseFromPaperType;
  petitionUploadProgress?: string;
  requestForPlaceOfTrialFile?: Blob;
  requestForPlaceOfTrialUploadProgress?: string;
  stinFile?: Blob;
  stinUploadProgress?: string;
};

export type CaseFromPaperType = {
  contactPrimary: {
    address1: string;
    address2: string;
    address3: string;
    city: string;
    countryType: string;
    name: string;
    paperPetitionEmail: string;
    phone: string;
    postalCode: string;
    state: string;
  };
  caseType: string;
  caseCaption: string;
  attachmentToPetitionFileSize?: number;
  attachmentToPetitionFile: Blob;
  hasVerifiedIrsNotice: boolean;
  isPaper: boolean;
  mailingDate: string;
  orderDesignatingPlaceOfTrial?: boolean;
  orderForCds: boolean;
  stinFile?: Blob;
  stinFileSize?: number;
  orderForFilingFee: boolean;
  partyType: string;
  petitionFile: Blob;
  petitionFileSize: number;
  petitionPaymentStatus: string;
  procedureType: string;
  receivedAt: string;
  applicationForWaiverOfFilingFeeFile?: Blob;
  corporateDisclosureFile?: Blob;
  requestForPlaceOfTrialFile?: Blob;
  status: string;
  contactSecondary?: {
    name: string;
  };
};

export const filePetitionFromPaperInteractor = async (
  applicationContext: any,
  {
    applicationForWaiverOfFilingFeeFile,
    applicationForWaiverOfFilingFeeUploadProgress,
    atpUploadProgress,
    attachmentToPetitionFile,
    corporateDisclosureFile,
    corporateDisclosureUploadProgress,
    petitionFile,
    petitionMetadata,
    petitionUploadProgress,
    requestForPlaceOfTrialFile,
    requestForPlaceOfTrialUploadProgress,
    stinFile,
    stinUploadProgress,
  }: FilePetitionFromPaperTypeDetailsType,
): Promise<RawCase> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.START_PAPER_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const petitionFileUpload = applicationContext
    .getUseCases()
    .uploadDocumentAndMakeSafeInteractor(applicationContext, {
      document: petitionFile,
      onUploadProgress: petitionUploadProgress,
    });

  let applicationForWaiverOfFilingFeeUpload;
  if (applicationForWaiverOfFilingFeeFile) {
    applicationForWaiverOfFilingFeeUpload = applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor(applicationContext, {
        document: applicationForWaiverOfFilingFeeFile,
        onUploadProgress: applicationForWaiverOfFilingFeeUploadProgress,
      });
  }

  let corporateDisclosureFileUpload;
  if (corporateDisclosureFile) {
    corporateDisclosureFileUpload = applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor(applicationContext, {
        document: corporateDisclosureFile,
        onUploadProgress: corporateDisclosureUploadProgress,
      });
  }

  let stinFileUpload;
  if (stinFile) {
    stinFileUpload = applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor(applicationContext, {
        document: stinFile,
        onUploadProgress: stinUploadProgress,
      });
  }

  let requestForPlaceOfTrialFileUpload;
  if (requestForPlaceOfTrialFile) {
    requestForPlaceOfTrialFileUpload = applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor(applicationContext, {
        document: requestForPlaceOfTrialFile,
        onUploadProgress: requestForPlaceOfTrialUploadProgress,
      });
  }

  let attachmentToPetitionFileUpload;
  if (attachmentToPetitionFile) {
    attachmentToPetitionFileUpload = applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor(applicationContext, {
        document: attachmentToPetitionFile,
        onUploadProgress: atpUploadProgress,
      });
  }

  await Promise.all([
    applicationForWaiverOfFilingFeeUpload,
    corporateDisclosureFileUpload,
    petitionFileUpload,
    requestForPlaceOfTrialFileUpload,
    stinFileUpload,
    attachmentToPetitionFileUpload,
  ]);

  return await applicationContext
    .getUseCases()
    .createCaseFromPaperInteractor(applicationContext, {
      applicationForWaiverOfFilingFeeFileId:
        await applicationForWaiverOfFilingFeeUpload,
      attachmentToPetitionFileId: await attachmentToPetitionFileUpload,
      corporateDisclosureFileId: await corporateDisclosureFileUpload,
      petitionFileId: await petitionFileUpload,
      petitionMetadata,
      requestForPlaceOfTrialFileId: await requestForPlaceOfTrialFileUpload,
      stinFileId: await stinFileUpload,
    });
};
