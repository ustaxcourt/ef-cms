import { JudgeActivityReportSearch } from '../../../../../shared/src/business/entities/judgeActivityReport/JudgeActivityReportSearch';
import { state } from '@web-client/presenter/app.cerebral';

export const validateJudgeActivityStatisticsReportSearchAction = ({
  get,
  path,
}: ActionProps) => {
  const { endDate, judges, startDate } = get(state.judgeActivityReport.filters);

  const { judgeName } = get(state.judgeActivityReport);
  const errors = new JudgeActivityReportSearch({
    endDate,
    judgeName,
    judges,
    startDate,
  }).getFormattedValidationErrors();

  if (errors) {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }

  return path.success();
};
