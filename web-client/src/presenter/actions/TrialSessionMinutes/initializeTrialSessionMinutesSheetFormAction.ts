import { applicationContext } from '@web-client/applicationContext';
import { state } from '@web-client/presenter/app.cerebral';
import { v4 as uuidv4 } from 'uuid';

export const initializeTrialSessionMinutesSheetFormAction = ({
  props,
  store,
}: ActionProps) => {
  const { caseDetail, trialSession } = props;

  const formattedTrialSession = applicationContext
    .getUtilities()
    .getFormattedTrialSessionDetails({
      applicationContext,
      trialSession,
    });

  console.log('Case Detail: ', caseDetail);
  store.set(state.minuteSheetForm.trialSessionMetadata, {
    courtReporter: formattedTrialSession.courtReporter,
    judge: formattedTrialSession.judge!.name,
    remoteSession: formattedTrialSession.isRemoteSession,
    trialClerk: formattedTrialSession.trialClerk!.name,
  });
  store.set(state.minuteSheetForm.caseMetadata.recalled[0].renderKey, uuidv4());
  store.set(state.minuteSheetForm.petitioners[0].renderKey, uuidv4());
};
