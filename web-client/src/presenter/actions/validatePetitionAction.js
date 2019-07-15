import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * validates the petition.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the validatePetition use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */
export const validatePetitionAction = ({ applicationContext, get, path }) => {
  const petition = get(state.petition);

  const form = omit(
    {
      ...get(state.form),
    },
    ['year', 'month', 'day', 'trialCities'],
  );

  const errors = applicationContext.getUseCases().validatePetitionInteractor({
    applicationContext,
    petition: { ...petition, ...form },
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
