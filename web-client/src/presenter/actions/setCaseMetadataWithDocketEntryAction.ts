import { compareCasesByDocketNumber } from '@shared/business/utilities/trialSession/getFormattedTrialSessionDetails';
import { state } from '@web-client/presenter/app.cerebral';

export const setCaseMetadataWithDocketEntryAction = ({
  props,
  store,
}: ActionProps<{ caseMetadata: RawCase; docketEntry: RawDocketEntry }>) => {
  const caseDetail = {
    ...props.caseMetadata,
    docketEntries: [props.docketEntry],
  };

  const unsortedConsolidatedCases = caseDetail.consolidatedCases || [];
  caseDetail.consolidatedCases = unsortedConsolidatedCases.sort(
    compareCasesByDocketNumber,
  );

  store.set(state.caseDetail, caseDetail);

  return { caseDetail };
};
