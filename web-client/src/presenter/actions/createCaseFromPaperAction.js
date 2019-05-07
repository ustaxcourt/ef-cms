import { checkDate } from './getFormCombinedWithCaseDetailAction';
import { omit } from 'lodash';
import { state } from 'cerebral';

export const setupPercentDone = (files, store) => {
  let totalSize = 0;
  const loadedAmounts = {};
  const startTime = new Date();

  const calculateTotalLoaded = () => {
    return Object.keys(loadedAmounts).reduce((acc, key) => {
      return loadedAmounts[key] + acc;
    }, 0);
  };

  Object.keys(files).forEach(key => {
    if (!files[key]) return;
    totalSize += files[key].size;
  });

  const createOnUploadProgress = key => {
    loadedAmounts[key] = 0;
    return progressEvent => {
      const { loaded } = progressEvent;
      const timeElapsed = new Date() - startTime;
      const uploadedBytes = calculateTotalLoaded();
      const uploadSpeed = uploadedBytes / (timeElapsed / 1000);
      const timeRemaining = Math.floor(
        (totalSize - uploadedBytes) / uploadSpeed,
      );
      loadedAmounts[key] = loaded;
      const percent = parseInt((uploadedBytes / totalSize) * 100);
      store.set(state.percentComplete, percent);
      store.set(state.timeRemaining, timeRemaining);
    };
  };

  store.set(state.percentComplete, 0);
  store.set(state.timeRemaining, Number.POSITIVE_INFINITY);

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
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function used for getting petition
 * @param {Object} providers.props the cerebral props object
 * @returns {Object} the next path based on if creation was successful or error
 */
export const createCaseFromPaperAction = async ({
  applicationContext,
  get,
  store,
  props,
  path,
}) => {
  const { petitionFile, ownershipDisclosureFile, stinFile } = get(
    state.petition,
  );

  const receivedAt = checkDate(props.computedDate);

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
    },
    store,
  );

  let caseDetail;

  try {
    caseDetail = await applicationContext.getUseCases().filePetitionFromPaper({
      applicationContext,
      ownershipDisclosureFile,
      ownershipDisclosureUploadProgress: progressFunctions.ownership,
      petitionFile,
      petitionMetadata: form,
      petitionUploadProgress: progressFunctions.petition,
      stinFile,
      stinUploadProgress: progressFunctions.stin,
    });
  } catch (err) {
    return path.error();
  }

  for (let document of caseDetail.documents) {
    await applicationContext.getUseCases().createCoverSheet({
      applicationContext,
      caseId: caseDetail.caseId,
      documentId: document.documentId,
    });
  }

  return path.success({
    caseDetail,
  });
};
