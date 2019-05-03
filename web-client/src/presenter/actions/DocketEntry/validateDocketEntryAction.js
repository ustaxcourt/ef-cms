import { state } from 'cerebral';

/**
 * validates the docket entry form.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context needed for getting the validation use case
 * @param {Object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {Object} providers.get the cerebral get function used for getting state.form
 * @param {Object} providers.props the cerebral props object
 * @returns {Object} the next path based on if validation was successful or error
 */
export const validateDocketEntryAction = ({
  applicationContext,
  path,
  get,
}) => {
  const entryMetadata = get(state.form);

  const errors = applicationContext.getUseCases().validateDocketEntry({
    applicationContext,
    entryMetadata,
  });

  if (!errors) {
    return path.success();
  } else {
    const errorDisplayOrder = [
      'primaryDocumentFile',
      'dateReceived',
      'eventCode',
      'previousDocument',
      'ordinalValue',
      'serviceDate',
      'freeText',
      'certificateOfServiceDate',
      'objections',
      'partyPrimary',
      'partySecondary',
      'partyRespondent',
    ];

    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errorDisplayOrder,
      errors,
    });
  }
};
