import { state } from 'cerebral';
import { omit } from 'lodash';

/**
 * validates the petition.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context needed for getting the validatePetition use case
 * @param {Object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {Object} providers.get the cerebral get function used for getting state.form
 * @returns {Object} the next path based on if validation was successful or error
 */
export default ({ applicationContext, path, get }) => {
  const petition = get(state.petition);

  const form = omit(
    {
      ...get(state.form),
    },
    ['year', 'month', 'day', 'trialCities'],
  );

  if (form.hasIrsNotice) {
    form.irsNoticeDate = `${get(state.form.year)}-${get(
      state.form.month,
    )}-${get(state.form.day)}`;

    form.irsNoticeDate = form.irsNoticeDate
      .split('-')
      .map(segment => (segment = segment.padStart(2, '0')))
      .join('-');
  }

  const errors = applicationContext.getUseCases().validatePetition({
    petition: { ...petition, ...form },
    applicationContext,
  });

  if (!errors) {
    return path.success();
  } else {
    return path.error({
      errors,
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
    });
  }
};
