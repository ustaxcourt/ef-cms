import { state } from '@web-client/presenter/app.cerebral';
// import { compareCasesByDocketNumber } from '@shared/business/utilities/trialSession/getFormattedTrialSessionDetails';

export const setMultiDocketedOriginalCaseAction = ({
  props,
  store,
}: ActionProps<{ multiDocketedOriginalCaseDetail: RawCase }>) => {
  //   const unsortedConsolidatedCases = props.caseDetail.consolidatedCases || [];
  //   props.caseDetail.consolidatedCases = unsortedConsolidatedCases.sort(
  //     compareCasesByDocketNumber,
  //   );

  store.set(
    state.multiDocketedOriginalCaseDetail,
    props.multiDocketedOriginalCaseDetail,
  );
};
