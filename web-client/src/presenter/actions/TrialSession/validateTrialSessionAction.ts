import { omit } from 'lodash';
import { preparedDateToISOString } from '../../../utilities/preparedDateToISOString';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * validates the trial session.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateTrialSessionAction = ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const estimatedEndDate = preparedDateToISOString(
    applicationContext,
    props.computedEstimatedEndDate,
  );

  const trialSession = omit(
    {
      ...get(state.form),
    },
    ['estimatedEndDateDay', 'estimatedEndDateMonth', 'estimatedEndDateYear'],
  );

  let errors = applicationContext
    .getUseCases()
    .validateTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...trialSession,
        estimatedEndDate,
      },
    });

  const { estimatedEndDateDay, estimatedEndDateMonth, estimatedEndDateYear } =
    get(state.form);

  if (
    get(state.form.estimatedEndDateText) &&
    !applicationContext
      .getUtilities()
      .isValidDateString(
        `${estimatedEndDateMonth}-${estimatedEndDateDay}-${estimatedEndDateYear}`,
      )
  ) {
    errors = {
      ...(errors || {}),
      estimatedEndDate: 'Please enter a valid estimated end date.',
    };
  }

  if (!errors) {
    return path.success();
  } else {
    errors.startDate = errors.startDate || errors.term;
    const errorDisplayOrder = [
      'startDate',
      'startTime',
      'estimatedEndDate',
      'swingSessionId',
      'sessionType',
      'maxCases',
      'trialLocation',
      'postalCode',
      'alternateTrialClerkName',
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
