import { sortByDocketNumberAndGroupConsolidatedCases } from '@shared/business/utilities/sorting/caseSorting';
import { state } from '@web-client/presenter/app.cerebral';

export const setCaseAction = ({
  props,
  store,
}: ActionProps<{ caseDetail: RawCase }>) => {
  const unsortedConsolidatedCases = props.caseDetail.consolidatedCases || [];
  props.caseDetail.consolidatedCases =
    sortByDocketNumberAndGroupConsolidatedCases(unsortedConsolidatedCases);

  store.set(state.caseDetail, props.caseDetail);
};
