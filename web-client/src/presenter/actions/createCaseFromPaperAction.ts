import { PaperCaseDataType } from '@shared/business/useCases/filePetitionFromPaperInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const createCaseFromPaperAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const petitionMetadata: PaperCaseDataType = get(state.form);
  const { fileUploadProgressMap } = props;

  let caseDetail: RawCase;
  try {
    caseDetail = await applicationContext
      .getUseCases()
      .filePetitionFromPaperInteractor(applicationContext, {
        applicationForWaiverOfFilingFeeUploadProgress:
          fileUploadProgressMap.waiverOfFilingFee,
        atpUploadProgress: fileUploadProgressMap.atp,
        corporateDisclosureUploadProgress: fileUploadProgressMap.corporate,
        petitionMetadata,
        petitionUploadProgress: fileUploadProgressMap.petition,
        requestForPlaceOfTrialUploadProgress:
          fileUploadProgressMap.requestForPlaceOfTrial,
        stinUploadProgress: fileUploadProgressMap.stin,
      });
  } catch (err) {
    return path.error();
  }

  return path.success({
    caseDetail,
  });
};
