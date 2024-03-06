import { compareCasesByDocketNumber } from '@shared/business/utilities/getFormattedTrialSessionDetails';
import { state } from '@web-client/presenter/app.cerebral';

export const setCaseAction = ({
  props,
  store,
}: ActionProps<{ caseDetail: RawCase }>) => {
  const unsortedConsolidatedCases = props.caseDetail.consolidatedCases || [];
  props.caseDetail.consolidatedCases = unsortedConsolidatedCases.sort(
    compareCasesByDocketNumber,
  );

  store.set(state.caseDetail, props.caseDetail);
};
