import { applicationContext } from '@web-client/applicationContext';
import { state } from '@web-client/presenter/app.cerebral';
import { v4 as uuidv4 } from 'uuid';

export const initializeTrialSessionMinutesSheetFormAction = ({
  props,
  store,
}: ActionProps) => {
  const { caseDetail, trialSession } = props;

  console.log('caseDetail', caseDetail);

  const formattedTrialSession = applicationContext
    .getUtilities()
    .getFormattedTrialSessionDetails({
      applicationContext,
      trialSession,
    });

  store.set(state.minuteSheetForm.trialSessionMetadata, {
    courtReporter: formattedTrialSession.courtReporter,
    judge: formattedTrialSession.judge!.name,
    remoteSession: formattedTrialSession.isRemoteSession,
    trialClerk: formattedTrialSession.trialClerk!.name,
  });

  const recalledRowRenderKey = uuidv4();
  const petitionerRowRenderKey = uuidv4();
  const respondentRowRenderKey = uuidv4();

  store.set(state.minuteSheetForm.caseMetadata.recalled[recalledRowRenderKey], {
    date: '',
    note: '',
    renderKey: recalledRowRenderKey,
    transcriptOrdered: false,
  });
  store.set(
    state.minuteSheetForm.petitioners.petitioners[petitionerRowRenderKey],
    {
      datesOfAppearance: '',
      name: '',
      renderKey: petitionerRowRenderKey,
      role: '',
    },
  );
  store.set(
    state.minuteSheetForm.respondents.respondents[respondentRowRenderKey],
    {
      datesOfAppearance: '',
      name: '',
      renderKey: respondentRowRenderKey,
      role: '',
    },
  );
};
