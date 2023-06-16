import { state } from '@web-client/presenter/app.cerebral';

export const setJudgeActivityReportFiltersAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const filterStartDate: string = props.startDate;
  const filterEndDate: string = props.endDate;
  const selectedJudge: string = props.judgeName;

  if (selectedJudge) {
    if (selectedJudge === 'All Judges') {
      const currentJudgesInfo = get(state.judges);
      const judgesSelection = (currentJudgesInfo || []).map(
        judge => judge.name,
      );

      store.set(
        state.judgeActivityReport.filters.judgesSelection,
        judgesSelection,
      );
    } else {
      store.set(state.judgeActivityReport.filters.judgesSelection, [
        selectedJudge,
      ]);
    }

    store.set(state.judgeActivityReport.filters.judgeName, selectedJudge);
  }
  if (filterStartDate || filterStartDate === '') {
    store.set(state.judgeActivityReport.filters.startDate, filterStartDate);
  }
  if (filterEndDate || filterEndDate === '') {
    store.set(state.judgeActivityReport.filters.endDate, filterEndDate);
  }
};
