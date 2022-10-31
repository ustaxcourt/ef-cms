import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../errors/errors';

export const filePetitionFromPaperInteractor = async (
  applicationContext: any,
  {
    applicationForWaiverOfFilingFeeFile,
    applicationForWaiverOfFilingFeeUploadProgress,
    ownershipDisclosureFile,
    ownershipDisclosureUploadProgress,
    petitionFile,
    petitionMetadata,
    petitionUploadProgress,
    requestForPlaceOfTrialFile,
    requestForPlaceOfTrialUploadProgress,
    stinFile,
    stinUploadProgress,
  }: {
    applicationForWaiverOfFilingFeeFile: string;
    applicationForWaiverOfFilingFeeUploadProgress: string;
    ownershipDisclosureFile: string;
    ownershipDisclosureUploadProgress: string;
    petitionFile: string;
    petitionMetadata: any;
    petitionUploadProgress: string;
    requestForPlaceOfTrialFile: string;
    requestForPlaceOfTrialUploadProgress: string;
    stinFile: string;
    stinUploadProgress: string;
  },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.START_PAPER_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let applicationForWaiverOfFilingFeeUpload;
  if (applicationForWaiverOfFilingFeeFile) {
    applicationForWaiverOfFilingFeeUpload = applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor(applicationContext, {
        document: applicationForWaiverOfFilingFeeFile,
        onUploadProgress: applicationForWaiverOfFilingFeeUploadProgress,
      });
  }

  const petitionFileUpload = applicationContext
    .getUseCases()
    .uploadDocumentAndMakeSafeInteractor(applicationContext, {
      document: petitionFile,
      onUploadProgress: petitionUploadProgress,
    });

  let ownershipDisclosureFileUpload;
  if (ownershipDisclosureFile) {
    ownershipDisclosureFileUpload = applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor(applicationContext, {
        document: ownershipDisclosureFile,
        onUploadProgress: ownershipDisclosureUploadProgress,
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

  await Promise.all([
    applicationForWaiverOfFilingFeeUpload,
    ownershipDisclosureFileUpload,
    petitionFileUpload,
    requestForPlaceOfTrialFileUpload,
    stinFileUpload,
  ]);

  return await applicationContext
    .getUseCases()
    .createCaseFromPaperInteractor(applicationContext, {
      applicationForWaiverOfFilingFeeFileId:
        await applicationForWaiverOfFilingFeeUpload,
      ownershipDisclosureFileId: await ownershipDisclosureFileUpload,
      petitionFileId: await petitionFileUpload,
      petitionMetadata,
      requestForPlaceOfTrialFileId: await requestForPlaceOfTrialFileUpload,
      stinFileId: await stinFileUpload,
    });
};
