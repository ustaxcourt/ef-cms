import { compareCasesByDocketNumber } from '@shared/business/utilities/trialSession/getFormattedTrialSessionDetails';
import { state } from '@web-client/presenter/app.cerebral';

export const setCaseMetadataAction = ({
  props,
  store,
}: ActionProps<{ caseMetadata: RawCase }>) => {
  const unsortedConsolidatedCases = props.caseMetadata.consolidatedCases || [];
  props.caseMetadata.consolidatedCases = unsortedConsolidatedCases.sort(
    compareCasesByDocketNumber,
  );

  store.set(state.caseDetail, props.caseMetadata);
};
