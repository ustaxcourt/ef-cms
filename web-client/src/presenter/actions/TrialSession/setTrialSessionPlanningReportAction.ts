import {
  PreviousTerm,
  TrialLocationData,
} from '@web-api/business/useCases/trialSessions/getTrialSessionPlanningReportDataInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const setTrialSessionPlanningReportAction = ({
  props,
  store,
}: ActionProps<{
  previousTerms: PreviousTerm[];
  trialLocationData: TrialLocationData[];
}>) => {
  const { previousTerms, trialLocationData } = props;

  store.set(state.trialSessionPlanningReportData.previousTerms, previousTerms);
  store.set(
    state.trialSessionPlanningReportData.trialLocationData,
    trialLocationData,
  );
};
