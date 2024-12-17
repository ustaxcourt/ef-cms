import { applicationContext } from '@web-client/applicationContext';
import { state } from '@web-client/presenter/app.cerebral';
import hash from 'object-hash';

export const trialSessionMinutesAutosaveAction = ({ get, props, store }) => {
  const { caseDetail, trialSession } = props;
  const currentMinuteSheetFormState = get(state.minuteSheetForm);
  const oldMinuteSheetFormStateSnapshot = get(state.minuteSheetFormSnapshot);
  const currentMinuteSheetFormStateSnapshot = hash(currentMinuteSheetFormState);
  const hasFormChanged =
    oldMinuteSheetFormStateSnapshot !== currentMinuteSheetFormStateSnapshot;

  if (hasFormChanged) {
    console.log('Make network request to update hash (autosave)');
    // 10419 TODO: continue hooking up get minute sheet and update minute sheet interactors
    applicationContext
      .getUseCases()
      .updateMinuteSheetInteractor(applicationContext, {
        docketNumber: caseDetail.docketNumber,
        trialSessionId: trialSession.trialSessionId,
      });
  } else {
    console.log('No changes!');
  }

  store.set(state.minuteSheetFormSnapshot, currentMinuteSheetFormStateSnapshot);
};
