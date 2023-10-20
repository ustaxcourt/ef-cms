import { compareCasesByDocketNumber } from '@shared/business/utilities/getFormattedTrialSessionDetails';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.caseDetail from props.caseDetail
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.caseDetail
 */
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
