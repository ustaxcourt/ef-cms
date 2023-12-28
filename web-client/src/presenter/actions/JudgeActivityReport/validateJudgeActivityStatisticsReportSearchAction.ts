import { JudgeActivityReportSearch } from '../../../../../shared/src/business/entities/judgeActivityReport/JudgeActivityReportSearch';
import { getJudgesFilters } from '@web-client/presenter/actions/PendingMotion/getPendingMotionDocketEntriesAction';
import { state } from '@web-client/presenter/app.cerebral';
export const validateJudgeActivityStatisticsReportSearchAction = ({
  get,
  path,
}: ActionProps) => {
  const { endDate, judgeName, startDate } = get(
    state.judgeActivityReport.filters,
  );

  const errors = new JudgeActivityReportSearch({
    endDate,
    judgeName,
    judges: getJudgesFilters(get),
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
