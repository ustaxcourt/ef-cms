import { aggregateStatisticsErrors } from './validatePetitionFromPaperAction';
import { omit } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const validateCaseDetailsAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);

  let errors = applicationContext
    .getUseCases()
    .validateCaseDetailInteractor(applicationContext, {
      caseDetail: {
        ...caseDetail,
        ...form,
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
