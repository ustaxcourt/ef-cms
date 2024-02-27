import { FileUploadProgressMapType } from '@shared/business/entities/EntityConstants';
import { PaperCaseDataType } from '@shared/business/useCases/filePetitionFromPaperInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const createCaseFromPaperAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{
  fileUploadProgressMap: FileUploadProgressMapType;
}>) => {
  const petitionMetadata: PaperCaseDataType = get(state.form);
  const { fileUploadProgressMap } = props;
  console.log('fileUploadProgressMap', fileUploadProgressMap);
  let caseDetail: RawCase;
  try {
    const {
      applicationForWaiverOfFilingFeeFileId,
      atpFileId,
      corporateDisclosureFileId,
      petitionFileId,
      requestForPlaceOfTrialFileId,
      stinFileId,
    } = await applicationContext
      .getUseCases()
      .filePetitionInteractor(applicationContext, {
        applicationForWaiverOfFilingFeeUploadProgress:
          fileUploadProgressMap.applicationForWaiverOfFilingFee,
        attachmentToPetitionUploadProgress:
          fileUploadProgressMap.attachmentToPetition,
        corporateDisclosureUploadProgress:
          fileUploadProgressMap.corporateDisclosure,
        petitionUploadProgress: fileUploadProgressMap.petition,
        requestForPlaceOfTrialUploadProgress:
          fileUploadProgressMap.requestForPlaceOfTrial,
        stinUploadProgress: fileUploadProgressMap.stin,
      });

    console.log('ids generated', {
      applicationForWaiverOfFilingFeeFileId,
      atpFileId,
      corporateDisclosureFileId,
      petitionFileId,
      requestForPlaceOfTrialFileId,
      stinFileId,
    });

    caseDetail = await applicationContext
      .getUseCases()
      .createCaseFromPaperInteractor(applicationContext, {
        applicationForWaiverOfFilingFeeFileId,
        attachmentToPetitionFileId: atpFileId,
        corporateDisclosureFileId,
        petitionFileId,
        petitionMetadata,
        requestForPlaceOfTrialFileId,
        stinFileId,
      });
  } catch (err) {
    console.log('!!!error', err);
    return path.error();
  }

  return path.success({
    caseDetail,
  });
};
