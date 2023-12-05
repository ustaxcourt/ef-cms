import { omit } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const aggregateStatisticsErrors = ({ errors, get }: ActionProps) => {
  let newErrorStatistics;
  let statisticsErrorMessages = [];

  const purgedErrors = omit(errors, [
    'irsDeficiencyAmount',
    'irsTotalPenalties',
    'penalties',
    'year',
  ]);

  if (purgedErrors.statistics) {
    newErrorStatistics = [];
    const formStatistics = get(state.form.statistics);

    if (formStatistics.length) {
      formStatistics.forEach((formStatistic, index) => {
        const errorStatistic = purgedErrors.statistics.find(
          s => s.index === index,
        );
        if (errorStatistic) {
          const messageYearOrPeriod =
            formStatistic.yearOrPeriod === 'Year' ? 'year' : 'period';
          const errMessage = `Enter ${messageYearOrPeriod}, deficiency amount, and total penalties`;

          newErrorStatistics.push({
            enterAllValues: errMessage,
            index,
          });

          statisticsErrorMessages.push(errMessage);
        } else {
          newErrorStatistics.push({});
        }
      });

      purgedErrors.statistics = newErrorStatistics;
    } else {
      statisticsErrorMessages = [purgedErrors.statistics];
    }
  }
  return { errors: purgedErrors, statisticsErrorMessages };
};

export const aggregatePetitionerErrors = ({ errors }) => {
  if (errors?.petitioners) {
    errors.petitioners.forEach(e => {
      if (e.index === 0) {
        errors.contactPrimary = omit(e, 'index');
      } else {
        errors.contactSecondary = omit(e, 'index');
      }
    });
    delete errors.petitioners;
  }
  return errors;
};

/**
 * validates the petition.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the validatePetition use case
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.props the cerebral props object
 * @returns {object} the next path based on if validation was successful or error
 */
export const validatePetitionFromPaperAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const form = get(state.form);

  let errors = applicationContext
    .getUseCases()
    .validatePetitionFromPaperInteractor(applicationContext, {
      petition: form,
    });

  if (!errors) {
    return path.success();
  } else {
    const errorDisplayMap = {
      statistics: 'Statistics',
    };

    const { errors: formattedErrors } = aggregateStatisticsErrors({
      errors,
      get,
    });

    errors = aggregatePetitionerErrors({ errors: formattedErrors });

    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errorDisplayMap,
      errors,
    });
  }
};
