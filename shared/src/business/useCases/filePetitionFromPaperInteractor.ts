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
    applicationForWaiverOfFilingFeeFile: string;
    applicationForWaiverOfFilingFeeUploadProgress: string;
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

  // console.log('ANSWERS applicationForWaiverOfFilingFeeUpload', {
  //   applicationForWaiverOfFilingFeeUpload:
  //     await applicationForWaiverOfFilingFeeUpload,
  //   //   corporateDisclosureFileUpload,
  //   //   petitionFileUpload,
  //   //   requestForPlaceOfTrialFileUpload,
  //   //   stinFileUpload,
  // });

  // console.log(
  //   'ANSWERS applicationForWaiverOfFilingFeeUpload',
  //   await applicationForWaiverOfFilingFeeUpload,
  // );

  // try {
  //   console.log('USER RUNNING TEST', user);
  //   await applicationForWaiverOfFilingFeeUpload;
  // } catch (err) {
  //   console.log('applicationForWaiverOfFilingFeeUpload ERROR', err);
  // }

  // try {
  //   console.log('USER RUNNING TEST', user);
  //   await corporateDisclosureFileUpload;
  // } catch (err) {
  //   console.log('corporateDisclosureFileUpload ERROR', err);
  // }

  // try {
  //   console.log('USER RUNNING TEST', user);
  //   await petitionFileUpload;
  // } catch (err) {
  //   console.log('petitionFileUpload ERROR', err);
  // }

  // try {
  //   console.log('USER RUNNING TEST', user);
  //   await requestForPlaceOfTrialFileUpload;
  // } catch (err) {
  //   console.log('requestForPlaceOfTrialFileUpload ERROR', err);
  // }

  // try {
  //   console.log('USER RUNNING TEST', user);
  //   await stinFileUpload;
  // } catch (err) {
  //   console.log('stinFileUpload ERROR', err);
  // }

  try {
    console.log('USER RUNNING TEST', user);

    await Promise.allSettled([
      applicationForWaiverOfFilingFeeUpload,
      corporateDisclosureFileUpload,
      petitionFileUpload,
      requestForPlaceOfTrialFileUpload,
      stinFileUpload,
    ]);
  } catch (err) {
    console.log('ERROR FROM BIG EVALUATIONS', err);
  }

  const caseCreated = await applicationContext
    .getUseCases()
    .createCaseFromPaperInteractor(applicationContext, {
      applicationForWaiverOfFilingFeeFileId:
        await applicationForWaiverOfFilingFeeUpload,
      corporateDisclosureFileId: await corporateDisclosureFileUpload,
      petitionFileId: await petitionFileUpload,
      petitionMetadata,
      requestForPlaceOfTrialFileId: await requestForPlaceOfTrialFileUpload,
      stinFileId: await stinFileUpload,
    });

  return caseCreated;
};
