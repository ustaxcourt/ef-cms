import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export const filePetitionInteractor = async (
  applicationContext: any,
  {
    atpFilesMetadata,
    corporateDisclosureFile,
    corporateDisclosureUploadProgress,
    petitionFile,
    petitionMetadata,
    petitionUploadProgress,
    stinFile,
    stinUploadProgress,
  }: {
    atpFilesMetadata?: any;
    corporateDisclosureFile?: any;
    corporateDisclosureUploadProgress?: any;
    petitionFile: any;
    petitionMetadata: any;
    petitionUploadProgress: any;
    stinFile: any;
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

  let atpFilesUploads = [];
  if (atpFilesMetadata?.length) {
    atpFilesUploads = atpFilesMetadata.map(atp => {
      return applicationContext
        .getUseCases()
        .uploadDocumentAndMakeSafeInteractor(applicationContext, {
          document: atp.file,
          onUploadProgress: atp.progressFunction,
        });
    });
  }
  console.log('atpFilesUploads', atpFilesUploads);

  try {
    const atpFileIds = await Promise.all(atpFilesUploads);
    console.log('atpFileIds', atpFileIds);

    const [corporateDisclosureFileId, petitionFileId, stinFileId]: string[] =
      await Promise.all([
        corporateDisclosureFileUpload,
        petitionFileUpload,
        stinFileUpload,
      ]);

    console.log('atpFileIds', atpFileIds);

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
    console.log('error in file petitions', error);
    throw new Error('Error uploading documents to file petition');
  }
};
