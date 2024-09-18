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

  const petitionMetadata: ElectronicCreatedCaseType = get(
    state.petitionFormatted,
  );

  const user = get(state.user);

  let caseDetail;
  let stinFile;

  try {
    let {
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

    caseDetail = await applicationContext
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
        docketNumber: caseDetail.docketNumber,
      });
  };

  const documentsThatNeedCoverSheet = caseDetail.docketEntries
    .filter(d => d.isFileAttached)
    .map(d => d.docketEntryId);

  // for security reasons, the STIN is not in the API response, but we already know the docketEntryId
  documentsThatNeedCoverSheet.push(stinFile);

  await Promise.all(documentsThatNeedCoverSheet.map(addCoversheet));

  const isPetitioner = user.role === ROLES.petitioner;
  const successTitle = `${isPetitioner ? 'Your' : 'The'} case has been assigned docket number ${caseDetail.docketNumberWithSuffix || caseDetail.docketNumber}`;
  const successMessage = `${isPetitioner ? 'Your' : 'The'} case has been created and${isPetitioner ? ' your' : ''} documents were sent to the U.S. Tax Court.`;

  return path.success({
    alertSuccess: {
      message: successMessage,
      title: successTitle,
    },
    caseDetail,
  });
};
