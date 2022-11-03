import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../errors/errors';

export const filePetitionInteractor = async (
  applicationContext: any,
  {
    ownershipDisclosureFile,
    ownershipDisclosureUploadProgress,
    petitionFile,
    petitionMetadata,
    petitionUploadProgress,
    stinFile,
    stinUploadProgress,
  }: {
    ownershipDisclosureFile: any;
    ownershipDisclosureUploadProgress: any;
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

  const [ownershipDisclosureFileId, petitionFileId, stinFileId] =
    await Promise.all([
      ownershipDisclosureFileUpload,
      petitionFileUpload,
      stinFileUpload,
    ]);

  const caseDetail = await applicationContext
    .getUseCases()
    .createCaseInteractor(applicationContext, {
      ownershipDisclosureFileId,
      petitionFileId,
      petitionMetadata,
      stinFileId,
    });

  return {
    caseDetail,
    stinFileId,
  };
};
