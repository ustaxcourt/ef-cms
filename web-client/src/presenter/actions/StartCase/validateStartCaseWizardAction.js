import { aggregatePetitionerErrors } from '../validatePetitionFromPaperAction';
import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * validates the petition based on the current wizard step.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the validatePetition use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateStartCaseWizardAction = ({
  applicationContext,
  get,
  path,
}) => {
  const petition = omit(
    {
      ...get(state.form),
    },
    'trialCities',
  );

  let errors = applicationContext
    .getUseCases()
    .validateStartCaseWizardInteractor(applicationContext, {
      petition,
    });

  if (!errors) {
    return path.success();
  } else {
    const errorDisplayOrder = [
      'petitionFile',
      'hasIrsNotice',
      'name',
      'inCareOf',
      'address1',
      'city',
      'state',
      'postalCode',
      'phone',
      'procedureType',
      'preferredTrialLocation',
    ];

    errors = aggregatePetitionerErrors({ errors });

    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errorDisplayOrder,
      errors,
    });
  }
};
