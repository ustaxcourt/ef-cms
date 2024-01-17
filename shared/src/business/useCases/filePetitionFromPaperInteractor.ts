import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

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
  }: {
    attachmentToPetitionFile: string;
    applicationForWaiverOfFilingFeeFile: string;
    applicationForWaiverOfFilingFeeUploadProgress: string;
    atpUploadProgress: string;
    corporateDisclosureFile: string;
    corporateDisclosureUploadProgress: string;
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
