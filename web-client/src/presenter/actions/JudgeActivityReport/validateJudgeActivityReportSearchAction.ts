import { JudgeActivityReportSearch } from '../../../../../shared/src/business/entities/judgeActivityReport/JudgeActivityReportSearch';
import { state } from '@web-client/presenter/app.cerebral';

export const validateJudgeActivityReportSearchAction = ({
  get,
  path,
}: ActionProps) => {
  const { judges } = get(state.judgeActivityReport.filters);

  const { judgeName } = get(state.judgeActivityReport);
  const errors = new JudgeActivityReportSearch({
    judgeName,
    judges,
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
