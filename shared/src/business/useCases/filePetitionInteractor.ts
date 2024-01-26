import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { isEmpty } from 'lodash';

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
    corporateDisclosureFile: any;
    corporateDisclosureUploadProgress: any;
    petitionFile: any;
    petitionMetadata: any;
    petitionUploadProgress: any;
    stinFile: any;
    stinUploadProgress: any;
    atpFilesMetadata: any;
  },
) => {
  console.log('atpFilesMetadata', atpFilesMetadata);
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

  let atpFilesUploads;
  if (!isEmpty(atpFilesMetadata)) {
    atpFilesUploads = Object.entries(atpFilesMetadata).map(([key, value]) => {
      return applicationContext
        .getUseCases()
        .uploadDocumentAndMakeSafeInteractor(applicationContext, {
          document: value.file,
          onUploadProgress: value.progressFunction,
        });
    });
  }

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

  const requestParams = {
    corporateDisclosureFileId,
    petitionFileId,
    petitionMetadata,
    stinFileId,
  };

  atpFileIds.forEach((atpFileId, index) => {
    requestParams[`atpFileId${index}`] = atpFileId;
  });

  console.log('atpFileIds', atpFileIds);

  console.log('requestParams', requestParams);

  const caseDetail = await applicationContext
    .getUseCases()
    .createCaseInteractor(applicationContext, requestParams);

  return {
    caseDetail,
    stinFileId,
  };
};
