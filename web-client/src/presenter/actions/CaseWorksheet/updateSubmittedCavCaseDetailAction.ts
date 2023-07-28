import { state } from '@web-client/presenter/app.cerebral';

export const updateSubmittedCavCaseDetailInStateAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { finalBriefDueDate, statusOfMatter } = props;
  console.log('finalBriefDueDate:', finalBriefDueDate);

  const submittedAndCavCasesByJudge: any[] = get(
    state.judgeActivityReportData.submittedAndCavCasesByJudge,
  );

  console.log('before:', submittedAndCavCasesByJudge);

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

  const submittedAndCavCasesByJudge2 = get(
    state.judgeActivityReportData.submittedAndCavCasesByJudge,
  );

  console.log('after:', submittedAndCavCasesByJudge2);
};
