import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export const filePetitionInteractor = async (
  applicationContext: any,
  {
    atpUploadProgress,
    corporateDisclosureUploadProgress,
    petitionMetadata,
    petitionUploadProgress,
    stinUploadProgress,
  }: {
    atpUploadProgress?: any;
    atpFilesMetadata?: any;
    corporateDisclosureUploadProgress?: any;
    petitionMetadata: any;
    petitionUploadProgress: any;
    stinUploadProgress: any;
  },
) => {
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

  let atpFilesUploads = [];
  if (atpUploadProgress) {
    atpFilesUploads = atpUploadProgress.map(atp => {
      return applicationContext
        .getUseCases()
        .uploadDocumentAndMakeSafeInteractor(applicationContext, {
          document: atp.file,
          onUploadProgress: atp.uploadProgress,
        });
    });
  }

  try {
    const [
      corporateDisclosureFileId,
      petitionFileId,
      stinFileId,
      ...atpFileIds
    ]: string[] = await Promise.all([
      corporateDisclosureFileUpload,
      petitionFileUpload,
      stinFileUpload,
      ...atpFilesUploads,
    ]);

    const caseDetail = await applicationContext
      .getUseCases()
      .createCaseInteractor(applicationContext, {
        atpFileIds,
        corporateDisclosureFileId,
        petitionFileId,
        petitionMetadata,
        stinFileId,
      });

    return {
      caseDetail,
      stinFileId,
    };
  } catch (error) {
    throw new Error('Error uploading documents to file petition');
  }
};
