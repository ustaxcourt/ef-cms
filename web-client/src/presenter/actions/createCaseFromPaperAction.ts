import { PaperCaseDataType } from '@shared/business/useCases/filePetitionFromPaperInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const createCaseFromPaperAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const petitionMetadata: PaperCaseDataType = get(state.form);
  const { fileUploadProgressMap: progressTrackerCbs } = props;

  let caseDetail: RawCase;
  try {
    caseDetail = await applicationContext
      .getUseCases()
      .filePetitionFromPaperInteractor(applicationContext, {
        applicationForWaiverOfFilingFeeUploadProgress:
          progressTrackerCbs.waiverOfFilingFee,
        atpUploadProgress: progressTrackerCbs.atp,
        corporateDisclosureUploadProgress: progressTrackerCbs.corporate,
        petitionMetadata,
        petitionUploadProgress: progressTrackerCbs.petition,
        requestForPlaceOfTrialUploadProgress:
          progressTrackerCbs.requestForPlaceOfTrial,
        stinUploadProgress: progressTrackerCbs.stin,
      });
  } catch (err) {
    return path.error();
  }

  return path.success({
    caseDetail,
  });
};
