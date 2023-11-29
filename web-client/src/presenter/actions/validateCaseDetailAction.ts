import {
  aggregatePetitionerErrors,
  aggregateStatisticsErrors,
} from './validatePetitionFromPaperAction';
import { state } from '@web-client/presenter/app.cerebral';

export const validateCaseDetailAction = ({
  applicationContext,
  get,
  path,
  store,
}: ActionProps) => {
  const form = get(state.form);

  let errors;
  if (form.isPaper) {
    errors = applicationContext
      .getUseCases()
      .validatePetitionFromPaperInteractor(applicationContext, {
        petition: form,
      });
  } else {
    errors = applicationContext
      .getUseCases()
      .validateCaseDetailInteractor(applicationContext, {
        caseDetail: form,
      });
  }

  errors = aggregatePetitionerErrors({ errors });

  store.set(state.validationErrors, errors);

  if (!errors) {
    return path.success({
      form,
    });
  } else {
    const errorDisplayMap = {
      statistics: 'Statistics',
    };

    const { errors: formattedErrors } = aggregateStatisticsErrors({
      errors,
      get,
    });

    return path.error({ errorDisplayMap, errors: formattedErrors });
  }
};
