import { state } from 'cerebral';
import { omit } from 'lodash';

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
  props,
}) => {
  const { petitionFile, ownershipDisclosureFile, stinFile } = get(
    state.petition,
  );

  const createdAt = props.computedDate;

  const form = omit(
    {
      ...get(state.form),
      createdAt,
    },
    ['year', 'month', 'day'],
  );

  form.contactPrimary.email = get(state.user.email);

  const caseDetail = await applicationContext
    .getUseCases()
    .filePetitionFromPaper({
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
