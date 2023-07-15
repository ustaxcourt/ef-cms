import { state } from '@web-client/presenter/app.cerebral';

/**
 * update props from modal state to pass to other actions
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const deleteCasePrimaryIssueInStateAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { docketNumber } = props;
  const submittedAndCavCasesByJudge: any[] = get(
    state.judgeActivityReportData.submittedAndCavCasesByJudge,
  );

  const updatedSubmittedAndCavCasesByJudge = submittedAndCavCasesByJudge.map(
    submittedOrCavCase => {
      if (submittedOrCavCase.docketNumber !== docketNumber)
        return submittedOrCavCase;
      return {
        ...submittedOrCavCase,
        primaryIssue: null,
      };
    },
  );

  store.set(
    state.judgeActivityReportData.submittedAndCavCasesByJudge,
    updatedSubmittedAndCavCasesByJudge,
  );

  return props;
};
