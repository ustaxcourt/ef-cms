import { omit } from 'lodash';
import { state } from 'cerebral';

export const setupPercentDone = (files, store) => {
  const loadedAmounts = {};
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
      const timeElapsed = new Date() - startTime;
      const uploadedBytes = calculateTotalLoaded();
      const uploadSpeed = uploadedBytes / (timeElapsed / 1000);
      const timeRemaining = Math.floor(
        (totalSize - uploadedBytes) / uploadSpeed,
      );
      const percent = parseInt((uploadedBytes / totalSize) * 100);
      store.set(state.percentComplete, percent);
      store.set(state.timeRemaining, timeRemaining);
    };
  };

  store.set(state.percentComplete, 0);
  store.set(state.timeRemaining, Number.POSITIVE_INFINITY);
  store.set(state.isUploading, true);

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
    ownershipDisclosureFile,
    petitionFile,
    requestForPlaceOfTrialFile,
    stinFile,
  } = get(state.form);

  const receivedAt = // AAAA-BB-CC
    (props.computedDate &&
      applicationContext
        .getUtilities()
        .prepareDateFromString(props.computedDate)
        .toISOString()) ||
    null;

  const form = omit(
    {
      ...get(state.form),
      receivedAt,
    },
    ['year', 'month', 'day'],
  );

  const progressFunctions = setupPercentDone(
    {
      ownership: ownershipDisclosureFile,
      petition: petitionFile,
      stin: stinFile,
      trial: requestForPlaceOfTrialFile,
    },
    store,
  );

  let caseDetail;

  try {
    caseDetail = await applicationContext
      .getUseCases()
      .filePetitionFromPaperInteractor({
        applicationContext,
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

  for (let document of caseDetail.documents) {
    await applicationContext.getUseCases().createCoverSheetInteractor({
      applicationContext,
      caseId: caseDetail.caseId,
      documentId: document.documentId,
    });
  }

  return path.success({
    caseDetail,
  });
};
