import { PaperCaseDataType } from '@shared/business/useCases/filePetitionFromPaperInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const createCaseFromPaperAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const petitionMetadata: PaperCaseDataType = get(state.form);
  const { uploadProgressCallbackMap: progressFunctions } = props;

  let caseDetail: RawCase;
  try {
    caseDetail = await applicationContext
      .getUseCases()
      .filePetitionFromPaperInteractor(applicationContext, {
        applicationForWaiverOfFilingFeeUploadProgress:
          progressFunctions.waiverOfFilingFee,
        atpUploadProgress: progressFunctions.atp,
        corporateDisclosureUploadProgress: progressFunctions.corporate,
        petitionMetadata,
        petitionUploadProgress: progressFunctions.petition,
        requestForPlaceOfTrialUploadProgress:
          progressFunctions.requestForPlaceOfTrial,
        stinUploadProgress: progressFunctions.stin,
      });
  } catch (err) {
    return path.error();
  }

  return path.success({
    caseDetail,
  });
};
