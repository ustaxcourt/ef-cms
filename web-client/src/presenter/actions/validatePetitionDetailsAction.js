import { aggregateStatisticsErrors } from './validatePetitionFromPaperAction';
import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * validates the edit petition details inputs
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */

export const validatePetitionDetailsAction = ({
  applicationContext,
  get,
  path,
  props,
}) => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const { irsNoticeDate, petitionPaymentDate, petitionPaymentWaivedDate } =
    props;

  let errors = applicationContext
    .getUseCases()
    .validateCaseDetailInteractor(applicationContext, {
      caseDetail: {
        ...caseDetail,
        ...form,
        irsNoticeDate,
        petitionPaymentDate,
        petitionPaymentWaivedDate,
        preferredTrialCity: form.preferredTrialCity
          ? form.preferredTrialCity
          : null,
      },
    });

  if (!errors) {
    return path.success();
  } else {
    const errorDisplayMap = {
      statistics: 'Statistics',
    };

    const { errors: formattedErrors, statisticsErrorMessages } =
      aggregateStatisticsErrors({
        errors,
        get,
      });

    const errorMessags = [
      ...Object.values(omit(errors, 'statistics')),
      ...statisticsErrorMessages,
    ];

    return path.error({
      alertError: {
        messages: errorMessags,
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errorDisplayMap,
      errors: formattedErrors,
    });
  }
};
