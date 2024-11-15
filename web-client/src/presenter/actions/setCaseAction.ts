import { Case } from '@shared/business/entities/cases/Case';
import { state } from '@web-client/presenter/app.cerebral';

export const setCaseAction = ({
  props,
  store,
}: ActionProps<{ caseDetail: RawCase }>) => {
  const unsortedConsolidatedCases = props.caseDetail.consolidatedCases || [];
  props.caseDetail.consolidatedCases =
    Case.sortByDocketNumberAndGroupConsolidatedCases(unsortedConsolidatedCases);

  store.set(state.caseDetail, props.caseDetail);
};
