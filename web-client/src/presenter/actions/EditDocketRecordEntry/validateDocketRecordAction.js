import { state } from 'cerebral';

/**
 * validates the docket record.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateDocketRecordAction = ({
  applicationContext,
  get,
  path,
}) => {
  const docketRecord = get(state.form);

  const errors = applicationContext
    .getUseCases()
    .validateDocketRecordInteractor({
      applicationContext,
      docketRecord,
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
