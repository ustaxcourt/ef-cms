import { checkDate } from './getFormCombinedWithCaseDetailAction';
import { omit } from 'lodash';
import { state } from 'cerebral';

export const setupPercentDone = (files, store) => {
  let totalSize = 0;
  let loadedAmounts = {};

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
      loadedAmounts[key] = loaded;
      const percent = parseInt((calculateTotalLoaded() / totalSize) * 100);
      store.set(state.percentComplete, percent);
    };
  };

  const funs = {};
  Object.keys(files).forEach(key => {
    if (!files[key]) return;
    funs[key] = createOnUploadProgress(key);
  });

  return funs;
};

/**
 * invokes the filePetition useCase.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function used for getting petition
 * @param {Object} providers.props the cerebral props object
 */
export const createCaseFromPaperAction = async ({
  applicationContext,
  get,
  store,
  props,
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

  const caseDetail = await applicationContext
    .getUseCases()
    .filePetitionFromPaper({
      applicationContext,
      ownershipDisclosureFile,
      ownershipDisclosureUploadProgress: progressFunctions.ownership,
      petitionFile,
      petitionMetadata: form,
      petitionUploadProgress: progressFunctions.petition,
      stinFile,
      stinUploadProgress: progressFunctions.stin,
    });

  for (let document of caseDetail.documents) {
    await applicationContext.getUseCases().createCoverSheet({
      applicationContext,
      caseId: caseDetail.caseId,
      documentId: document.documentId,
    });
  }

  return {
    caseDetail,
  };
};
