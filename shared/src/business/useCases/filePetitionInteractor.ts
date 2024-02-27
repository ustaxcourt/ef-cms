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

  let atpFileUpload;
  if (atpUploadProgress) {
    atpFileUpload = applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor(applicationContext, {
        document: atpUploadProgress.file,
        onUploadProgress: atpUploadProgress.uploadProgress,
      });
  }

  try {
    const [
      corporateDisclosureFileId,
      petitionFileId,
      stinFileId,
      atpFileId,
    ]: string[] = await Promise.all([
      corporateDisclosureFileUpload,
      petitionFileUpload,
      stinFileUpload,
      atpFileUpload,
    ]);

    const caseDetail = await applicationContext
      .getUseCases()
      .createCaseInteractor(applicationContext, {
        atpFileId,
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
