import {
  CreatedCaseType,
  FileUploadProgressType,
} from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const createCaseFromPaperAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{
  fileUploadProgressMap: Record<string, FileUploadProgressType>;
}>) => {
  const user = get(state.user);
  const petitionMetadata: CreatedCaseType = get(state.form);
  const { fileUploadProgressMap } = props;
  let caseDetail: RawCase;

  const attachmentToPetitionUploadProgress =
    fileUploadProgressMap.attachmentToPetition
      ? ([
          fileUploadProgressMap.attachmentToPetition,
        ] as FileUploadProgressType[])
      : undefined;

  try {
    const {
      applicationForWaiverOfFilingFeeFileId,
      attachmentToPetitionFileIds,
      corporateDisclosureFileId,
      petitionFileId,
      requestForPlaceOfTrialFileId,
      stinFileId,
    } = await applicationContext.getUseCases().generateDocumentIds(
      applicationContext,
      {
        applicationForWaiverOfFilingFeeUploadProgress:
          fileUploadProgressMap.applicationForWaiverOfFilingFee,
        attachmentToPetitionUploadProgress,
        corporateDisclosureUploadProgress:
          fileUploadProgressMap.corporateDisclosure,
        petitionUploadProgress: fileUploadProgressMap.petition,
        requestForPlaceOfTrialUploadProgress:
          fileUploadProgressMap.requestForPlaceOfTrial,
        stinUploadProgress: fileUploadProgressMap.stin,
      },
      user,
    );

    caseDetail = await applicationContext
      .getUseCases()
      .createCaseFromPaperInteractor(applicationContext, {
        applicationForWaiverOfFilingFeeFileId,
        attachmentToPetitionFileId: attachmentToPetitionFileIds[0],
        corporateDisclosureFileId,
        petitionFileId,
        petitionMetadata,
        requestForPlaceOfTrialFileId,
        stinFileId,
      });
  } catch (err) {
    return path.error();
  }

  return path.success({
    caseDetail,
  });
};
