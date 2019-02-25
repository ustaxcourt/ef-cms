import { state } from 'cerebral';
import { omit } from 'lodash';

/**
 * invokes the filePetition useCase.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function used for getting petition
 * @param {Object} providers.store the cerebral store object used for getting petition
 */
export const createCaseAction = async ({ applicationContext, get, store }) => {
  const { petitionFile, ownershipDisclosureFile } = get(state.petition);

  const fileHasUploaded = () => {
    store.set(
      state.petition.uploadsFinished,
      get(state.petition.uploadsFinished) + 1,
    );
  };

  const form = omit(
    {
      ...get(state.form),
      irsNoticeDate: `${get(state.form.year)}-${get(state.form.month)}-${get(
        state.form.day,
      )}`,
    },
    ['year', 'month', 'day', 'trialCities', 'signature'],
  );

  await applicationContext.getUseCases().filePetition({
    applicationContext,
    petitionMetadata: form,
    petitionFile,
    ownershipDisclosureFile,
    fileHasUploaded,
  });
};
