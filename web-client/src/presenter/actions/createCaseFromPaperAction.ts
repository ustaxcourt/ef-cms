import { CaseFromPaperType } from '@shared/business/useCases/filePetitionFromPaperInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const setupPercentDone = <T extends Record<string, any | undefined>>(
  files: T,
  store: any,
): Record<keyof T, (progressEvent: any) => void> => {
  const loadedAmounts: Record<string, number> = {};
  // O.K. to use Date constructor for calculating time duration
  // eslint-disable-next-line @miovision/disallow-date/no-new-date
  const startTime = new Date();
  const totalSizes: Record<string, number> = {};

  const calculateTotalSize = () => {
    return Object.keys(loadedAmounts).reduce((acc, key) => {
      return totalSizes[key] + acc;
    }, 0);
  };
  const calculateTotalLoaded = () => {
    return Object.keys(loadedAmounts).reduce((acc, key) => {
      return loadedAmounts[key] + acc;
    }, 0);
  };

  Object.keys(files).forEach(key => {
    if (!files[key]) return;
    totalSizes[key] = files[key].size;
  });

  const createOnUploadProgress = key => {
    loadedAmounts[key] = 0;
    return progressEvent => {
      const { isDone, isHavingSystemIssues, loaded, total } = progressEvent;
      if (total) {
        totalSizes[key] = total;
      }
      loadedAmounts[key] = isDone ? totalSizes[key] : loaded;
      const totalSize = calculateTotalSize();
      // O.K. to use Date constructor for calculating time duration
      // eslint-disable-next-line @miovision/disallow-date/no-new-date
      const timeElapsed = new Date() - startTime;
      const uploadedBytes = calculateTotalLoaded();
      const uploadSpeed = uploadedBytes / (timeElapsed / 1000);
      const timeRemaining = Math.floor(
        (totalSize - uploadedBytes) / uploadSpeed,
      );
      const percent = parseInt((uploadedBytes / totalSize) * 100);
      store.set(state.fileUploadProgress.percentComplete, percent);
      store.set(state.fileUploadProgress.timeRemaining, timeRemaining);
      store.set(
        state.fileUploadProgress.isHavingSystemIssues,
        isHavingSystemIssues,
      );
    };
  };

  store.set(state.fileUploadProgress.percentComplete, 0);
  store.set(state.fileUploadProgress.timeRemaining, Number.POSITIVE_INFINITY);
  store.set(state.fileUploadProgress.isUploading, true);

  const uploadProgressCallbackMap = {} as any;

  Object.keys(files).forEach(key => {
    if (!files[key]) return;
    uploadProgressCallbackMap[key] = createOnUploadProgress(key);
  });

  return uploadProgressCallbackMap as Record<
    keyof T,
    (progressEvent: any) => void
  >;
};

export const createCaseFromPaperAction = async ({
  applicationContext,
  get,
  path,
  store,
}: ActionProps) => {
  const petitionMetadata: CaseFromPaperType = get(state.form);

  const {
    applicationForWaiverOfFilingFeeFile,
    attachmentToPetitionFile,
    corporateDisclosureFile,
    petitionFile,
    requestForPlaceOfTrialFile,
    stinFile,
  } = get(state.form) as CaseFromPaperType;

  const progressFunctions = setupPercentDone(
    {
      atp: attachmentToPetitionFile,
      corporate: corporateDisclosureFile,
      petition: petitionFile,
      stin: stinFile,
      trial: requestForPlaceOfTrialFile,
      waiverOfFilingFee: applicationForWaiverOfFilingFeeFile,
    },
    store,
  );

  let caseDetail: RawCase;
  try {
    caseDetail = await applicationContext
      .getUseCases()
      .filePetitionFromPaperInteractor(applicationContext, {
        applicationForWaiverOfFilingFeeFile,
        applicationForWaiverOfFilingFeeUploadProgress:
          progressFunctions.waiverOfFilingFee,
        atpUploadProgress: progressFunctions.atp,
        attachmentToPetitionFile,
        corporateDisclosureFile,
        corporateDisclosureUploadProgress: progressFunctions.corporate,
        petitionFile,
        petitionMetadata,
        petitionUploadProgress: progressFunctions.petition,
        requestForPlaceOfTrialFile,
        requestForPlaceOfTrialUploadProgress: progressFunctions.trial,
        stinFile,
        stinUploadProgress: progressFunctions.stin,
      });
  } catch (err) {
    return path.error();
  }

  return path.success({
    caseDetail,
  });
};
