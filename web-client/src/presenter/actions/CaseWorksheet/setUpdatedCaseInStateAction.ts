import { state } from '@web-client/presenter/app.cerebral';

export const setUpdatedCaseInStateAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { updatedCase } = props;

  const { submittedAndCavCasesByJudge } = get(state.judgeActivityReportData);

  const index = submittedAndCavCasesByJudge.findIndex(
    aCase => aCase.docketNumber === updatedCase.docketNumber,
  );

  store.set(
    state.judgeActivityReportData.submittedAndCavCasesByJudge[index],
    updatedCase,
  );
};
