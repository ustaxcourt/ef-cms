import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * validates the petition.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the validatePetition use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @param {object} providers.props the cerebral props object
 * @returns {object} the next path based on if validation was successful or error
 */
export const validatePetitionFromPaperAction = ({
  applicationContext,
  get,
  path,
  props,
}) => {
  const petition = get(state.petition);

  const receivedAt = props.computedDate;

  const form = omit(
    {
      ...get(state.form),
    },
    ['year', 'month', 'day'],
  );

  const errors = applicationContext
    .getUseCases()
    .validatePetitionFromPaperInteractor({
      applicationContext,
      petition: { ...petition, ...form, receivedAt },
    });

  if (!errors) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }
};
