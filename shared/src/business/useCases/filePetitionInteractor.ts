import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export const filePetitionInteractor = async (
  applicationContext: any,
  {
    corporateDisclosureFile,
    corporateDisclosureUploadProgress,
    petitionFile,
    petitionMetadata,
    petitionUploadProgress,
    stinFile,
    stinUploadProgress,
  }: {
    corporateDisclosureFile: any;
    corporateDisclosureUploadProgress: any;
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

  //TODO: fill
  let atpFilesUpload;
  if (atpFiles?.length) {
    atpFiles.map(atpFile => {
      return applicationContext
        .getUseCases()
        .uploadDocumentAndMakeSafeInteractor(applicationContext, {
          document: stinFile,
          onUploadProgress: stinUploadProgress,
        });
    });
  }

  const [corporateDisclosureFileId, petitionFileId, stinFileId] =
    await Promise.all([
      corporateDisclosureFileUpload,
      petitionFileUpload,
      stinFileUpload,
    ]);

  const caseDetail = await applicationContext
    .getUseCases()
    .createCaseInteractor(applicationContext, {
      corporateDisclosureFileId,
      petitionFileId,
      petitionMetadata,
      stinFileId,
    });

  return {
    caseDetail,
    stinFileId,
  };
};
