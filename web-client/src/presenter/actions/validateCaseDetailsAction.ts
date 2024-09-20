import { aggregateStatisticsErrors } from './validatePetitionFromPaperAction';
import { omit } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const validateCaseDetailsAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const user = get(state.user);

  let errors = await applicationContext
    .getUseCases()
    .validateCaseDetailInteractor(
      {
        caseDetail: {
          ...caseDetail,
          ...form,
          petitionPaymentDate: form.petitionPaymentDate || null,
          petitionPaymentMethod: form.petitionPaymentMethod || null,
          preferredTrialCity: form.preferredTrialCity
            ? form.preferredTrialCity
            : null,
        },
      },
      user,
    );

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
