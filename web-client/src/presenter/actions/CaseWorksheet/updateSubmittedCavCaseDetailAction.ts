import { state } from '@web-client/presenter/app.cerebral';

export const updateSubmittedCavCaseDetailInStateAction = ({
  props,
  store,
}: ActionProps) => {
  const { finalBriefDueDate, statusOfMatter } = props;

  if (finalBriefDueDate) {
    store.set(
      state.judgeActivityReportData.submittedAndCavCasesByJudge[0]
        .finalBriefDueDate,
      finalBriefDueDate,
    );
  }

  if (statusOfMatter) {
    store.set(
      state.judgeActivityReportData.submittedAndCavCasesByJudge[0]
        .statusOfMatter,
      statusOfMatter,
    );
  }
};
