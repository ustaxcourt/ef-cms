import { ElectronicCreatedCaseType } from '@web-api/business/useCases/createCaseInteractor';
import {
  FileUploadProgressType,
  FileUploadProgressValueType,
  PETITION_TYPES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const saveAndSubmitCaseAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{
  fileUploadProgressMap: Record<string, FileUploadProgressValueType>;
}>) => {
  const { fileUploadProgressMap } = props;

  const petitionMetadata = get(state.petitionFormatted) as unknown as ElectronicCreatedCaseType;

  const user = get(state.user);

  let createCaseResult: {
    docketNumber: string;
    docketNumberWithSuffix: string;
    docketEntryIds: string[];
  };
  let stinFile: string;

  try {
    const {
      attachmentToPetitionFileIds,
      corporateDisclosureFileId,
      petitionFileId,
      stinFileId,
    } = await applicationContext.getUseCases().generateDocumentIds(
      applicationContext,
      {
        attachmentToPetitionUploadProgress:
          fileUploadProgressMap.attachmentToPetition as FileUploadProgressType[],
        corporateDisclosureUploadProgress:
          fileUploadProgressMap.corporateDisclosure as FileUploadProgressType,
        petitionUploadProgress:
          fileUploadProgressMap.petition as FileUploadProgressType,
        stinUploadProgress:
          fileUploadProgressMap.stin as FileUploadProgressType,
      },
      user,
    );

    stinFile = stinFileId;

    createCaseResult = await applicationContext
      .getUseCases()
      .createCaseInteractor(applicationContext, {
        attachmentToPetitionFileIds,
        corporateDisclosureFileId,
        petitionFileId:
          petitionMetadata.petitionType === PETITION_TYPES.userUploaded
            ? petitionFileId
            : petitionMetadata.petitionFileId!,
        petitionMetadata,
        stinFileId: stinFile,
      });
  } catch (err) {
    return path.error();
  }

  const addCoversheet = docketEntryId => {
    return applicationContext
      .getUseCases()
      .addCoversheetInteractor(applicationContext, {
        docketEntryId,
        docketNumber: createCaseResult.docketNumber,
      });
  };

  const documentsThatNeedCoverSheet = [...createCaseResult.docketEntryIds];

  // for security reasons, the STIN is not in the API response, but we already know the docketEntryId
  documentsThatNeedCoverSheet.push(stinFile);

  await Promise.all(documentsThatNeedCoverSheet.map(addCoversheet));

  const isPetitioner = user.role === ROLES.petitioner;
  const successTitle = `${isPetitioner ? 'Your' : 'The'} case has been assigned docket number ${createCaseResult.docketNumberWithSuffix || createCaseResult.docketNumber}`;
  const successMessage = `${isPetitioner ? 'Your' : 'The'} case has been created and${isPetitioner ? ' your' : ''} documents were sent to the U.S. Tax Court.`;

  return path.success({
    alertSuccess: {
      message: successMessage,
      title: successTitle,
    },
    caseDetail: {
      docketNumber: createCaseResult.docketNumber,
      docketNumberWithSuffix: createCaseResult.docketNumberWithSuffix,
    },
  });
};
