import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

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
  console.log(
    'progresses at the top of the interactor',
    applicationForWaiverOfFilingFeeUploadProgress,
    attachmentToPetitionUploadProgress,
    corporateDisclosureUploadProgress,
    petitionUploadProgress,
    requestForPlaceOfTrialUploadProgress,
    stinUploadProgress,
  );
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.PETITION)) {
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
        document: atpUploadProgress.file,
        onUploadProgress: atpUploadProgress.uploadProgress,
      });
  }

  console.log(
    'uploads before the promise.all',
    applicationForWaiverOfFilingFeeUpload,
    corporateDisclosureFileUpload,
    petitionFileUpload,
    requestForPlaceOfTrialFileUpload,
    stinFileUpload,
    attachmentToPetitionUpload,
  );

  try {
    const [
      applicationForWaiverOfFilingFeeFileId,
      corporateDisclosureFileId,
      petitionFileId,
      requestForPlaceOfTrialFileId,
      stinFileId,
      atpFileId,
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
      atpFileId,
      corporateDisclosureFileId,
      petitionFileId,
      requestForPlaceOfTrialFileId,
      stinFileId,
    };

    // const caseDetail = await applicationContext
    //   .getUseCases()
    //   .createCaseInteractor(applicationContext, {
    //     atpFileId,
    //     corporateDisclosureFileId,
    //     petitionFileId,
    //     petitionMetadata,
    //     stinFileId,
    //   });

    // return {
    //   caseDetail,
    //   stinFileId,
    // };
  } catch (error) {
    throw new Error('Error uploading documents to file petition');
  }
};
