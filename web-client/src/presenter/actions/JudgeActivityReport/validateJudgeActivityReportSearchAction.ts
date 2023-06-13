import { JudgeActivityReportSearch } from '../../../../../shared/src/business/entities/judgeActivityReport/JudgeActivityReportSearch';
import { state } from 'cerebral';

export const validateJudgeActivityReportSearchAction = ({
  get,
  path,
}: ActionProps) => {
  const { endDate, judgesSelection, startDate } = get(
    state.judgeActivityReport.filters,
  );

  let errors;

  judgesSelection.forEach(eachJudge => {
    errors = new JudgeActivityReportSearch({
      endDate,
      judgeName: eachJudge,
      startDate,
    }).getFormattedValidationErrors();
  });

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
