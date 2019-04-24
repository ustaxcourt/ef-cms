import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * invokes the filePetition useCase.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function used for getting petition
 */
export const createCaseAction = async ({ applicationContext, get }) => {
  const { petitionFile, ownershipDisclosureFile, stinFile } = get(
    state.petition,
  );

  const form = omit(
    {
      ...get(state.form),
    },
    ['year', 'month', 'day', 'trialCities', 'signature'],
  );

  form.contactPrimary.email = get(state.user.email);

  const caseDetail = await applicationContext.getUseCases().filePetition({
    applicationContext,
    ownershipDisclosureFile,
    petitionFile,
    petitionMetadata: form,
    stinFile,
  });

  return {
    caseDetail,
  };
};
