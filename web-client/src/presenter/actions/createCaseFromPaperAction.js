import { omit } from 'lodash';
import { state } from 'cerebral';

export const setupPercentDone = (files, store) => {
  const loadedAmounts = {};
  // O.K. to use Date constructor for calculating time duration
  // eslint-disable-next-line @miovision/disallow-date/no-new-date
  const startTime = new Date();
  const totalSizes = {};

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
      const { isDone, loaded, total } = progressEvent;
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
    };
  };

  store.set(state.fileUploadProgress.percentComplete, 0);
  store.set(state.fileUploadProgress.timeRemaining, Number.POSITIVE_INFINITY);
  store.set(state.fileUploadProgress.isUploading, true);

  const uploadProgressCallbackMap = {};
  Object.keys(files).forEach(key => {
    if (!files[key]) return;
    uploadProgressCallbackMap[key] = createOnUploadProgress(key);
  });

  return uploadProgressCallbackMap;
};

/**
 * invokes the filePetition useCase.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function used for getting petition
 * @param {object} providers.props the cerebral props object
 * @returns {object} the next path based on if creation was successful or error
 */
export const createCaseFromPaperAction = async ({
  applicationContext,
  get,
  path,
  props,
  store,
}) => {
  const {
    applicationForWaiverOfFilingFeeFile,
    ownershipDisclosureFile,
    petitionFile,
    requestForPlaceOfTrialFile,
    stinFile,
  } = get(state.form);

  const receivedAt = // AAAA-BB-CC
    (props.receivedAt &&
      applicationContext
        .getUtilities()
        .prepareDateFromString(props.receivedAt)
        .toISOString()) ||
    null;

  const form = omit(
    {
      ...get(state.form),
      petitionPaymentDate: props.petitionPaymentDate,
      petitionPaymentWaivedDate: props.petitionPaymentWaivedDate,
      receivedAt,
    },
    ['receivedAtYear', 'receivedAtMonth', 'receivedAtDay'],
  );

  const progressFunctions = setupPercentDone(
    {
      ownership: ownershipDisclosureFile,
      petition: petitionFile,
      stin: stinFile,
      trial: requestForPlaceOfTrialFile,
      waiverOfFilingFee: applicationForWaiverOfFilingFeeFile,
    },
    store,
  );

  let caseDetail;

  try {
    caseDetail = await applicationContext
      .getUseCases()
      .filePetitionFromPaperInteractor(applicationContext, {
        applicationForWaiverOfFilingFeeFile,
        applicationForWaiverOfFilingFeeUploadProgress:
          progressFunctions.waiverOfFilingFee,
        ownershipDisclosureFile,
        ownershipDisclosureUploadProgress: progressFunctions.ownership,
        petitionFile,
        petitionMetadata: form,
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
