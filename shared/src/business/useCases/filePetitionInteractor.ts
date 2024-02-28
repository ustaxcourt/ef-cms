import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

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

export const filePetitionInteractor = async (
  applicationContext: any,
  {
    applicationForWaiverOfFilingFeeUploadProgress,
    attachmentToPetitionUploadProgress,
    corporateDisclosureUploadProgress,
    petitionUploadProgress,
    requestForPlaceOfTrialUploadProgress,
    stinUploadProgress,
  }: {
    applicationForWaiverOfFilingFeeUploadProgress?: any;
    attachmentToPetitionUploadProgress?: any;
    corporateDisclosureUploadProgress?: any;
    petitionUploadProgress: any;
    requestForPlaceOfTrialUploadProgress?: any;
    stinUploadProgress: any;
  },
) => {
  const user = applicationContext.getCurrentUser();

  const hasPermissions =
    isAuthorized(user, ROLE_PERMISSIONS.PETITION) ||
    isAuthorized(user, ROLE_PERMISSIONS.START_PAPER_CASE);

  if (!hasPermissions) {
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

  let attachmentToPetitionUpload;
  if (attachmentToPetitionUploadProgress) {
    attachmentToPetitionUpload = applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor(applicationContext, {
        document: attachmentToPetitionUploadProgress.file,
        onUploadProgress: attachmentToPetitionUploadProgress.uploadProgress,
      });
  }

  try {
    const [
      applicationForWaiverOfFilingFeeFileId,
      corporateDisclosureFileId,
      petitionFileId,
      requestForPlaceOfTrialFileId,
      stinFileId,
      attachmentToPetitionFileId,
    ]: string[] = await Promise.all([
      applicationForWaiverOfFilingFeeUpload,
      corporateDisclosureFileUpload,
      petitionFileUpload,
      requestForPlaceOfTrialFileUpload,
      stinFileUpload,
      attachmentToPetitionUpload,
    ]);

    return {
      applicationForWaiverOfFilingFeeFileId,
      attachmentToPetitionFileId,
      corporateDisclosureFileId,
      petitionFileId,
      requestForPlaceOfTrialFileId,
      stinFileId,
    };
  } catch (error) {
    throw new Error('Error uploading documents to file petition');
  }
};
