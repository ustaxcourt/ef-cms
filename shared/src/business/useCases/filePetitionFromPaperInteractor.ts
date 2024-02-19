import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export type FilePetitionFromPaperTypeDetailsType = {
  applicationForWaiverOfFilingFeeUploadProgress?: (progressEvent: any) => void;
  atpUploadProgress?: (progressEvent: any) => void;
  corporateDisclosureUploadProgress?: (progressEvent: any) => void;
  petitionMetadata: PaperCaseDataType;
  petitionUploadProgress?: (progressEvent: any) => void;
  requestForPlaceOfTrialUploadProgress?: (progressEvent: any) => void;
  stinUploadProgress?: (progressEvent: any) => void;
};

export type PaperCaseDataType = {
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
    applicationForWaiverOfFilingFeeUploadProgress,
    atpUploadProgress,
    corporateDisclosureUploadProgress,
    petitionMetadata,
    petitionUploadProgress,
    requestForPlaceOfTrialUploadProgress,
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
      document: petitionUploadProgress.file,
      onUploadProgress: petitionUploadProgress.uploadProgress,
    });

  let applicationForWaiverOfFilingFeeUpload;
  if (applicationForWaiverOfFilingFeeUploadProgress) {
    applicationForWaiverOfFilingFeeUpload = applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor(applicationContext, {
        document: applicationForWaiverOfFilingFeeUploadProgress.file,
        onUploadProgress:
          applicationForWaiverOfFilingFeeUploadProgress.uploadProgress,
      });
  }

  let corporateDisclosureFileUpload;
  if (corporateDisclosureUploadProgress) {
    corporateDisclosureFileUpload = applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor(applicationContext, {
        document: corporateDisclosureUploadProgress.file,
        onUploadProgress: corporateDisclosureUploadProgress.uploadProgress,
      });
  }

  let stinFileUpload;
  if (stinUploadProgress) {
    stinFileUpload = applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor(applicationContext, {
        document: stinUploadProgress.file,
        onUploadProgress: stinUploadProgress.uploadProgress,
      });
  }

  let requestForPlaceOfTrialFileUpload;
  if (requestForPlaceOfTrialUploadProgress) {
    requestForPlaceOfTrialFileUpload = applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor(applicationContext, {
        document: requestForPlaceOfTrialUploadProgress.file,
        onUploadProgress: requestForPlaceOfTrialUploadProgress.uploadProgress,
      });
  }

  let attachmentToPetitionFileUpload;
  if (atpUploadProgress) {
    attachmentToPetitionFileUpload = applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor(applicationContext, {
        document: atpUploadProgress.file,
        onUploadProgress: atpUploadProgress.progressFunction,
      });
  }

  // todo: might not need since its been resolved in the createCaseFromPaperInteractor call
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
