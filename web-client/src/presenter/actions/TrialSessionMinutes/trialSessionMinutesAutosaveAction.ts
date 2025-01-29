import { applicationContext } from '@web-client/applicationContext';
import { state } from '@web-client/presenter/app.cerebral';
import hash from 'object-hash';

export const trialSessionMinutesAutosaveAction = async ({
  get,
  props,
  store,
}) => {
  const caseDetail = get(state.caseDetail);
  const trialSession = get(state.trialSession);
  const currentMinuteSheetFormState = get(state.minuteSheetForm);

  const { forceAutosave } = props;
  const oldMinuteSheetFormStateSnapshot = get(state.minuteSheetFormSnapshot);
  const currentMinuteSheetFormStateSnapshot = hash(currentMinuteSheetFormState);
  const hasFormChanged =
    oldMinuteSheetFormStateSnapshot !== currentMinuteSheetFormStateSnapshot;

  if (hasFormChanged || forceAutosave) {
    await applicationContext
      .getUseCases()
      .updateMinuteSheetInteractor(applicationContext, {
        docketNumber: caseDetail.docketNumber,
        minuteSheet: currentMinuteSheetFormState,
        trialSessionId: trialSession.trialSessionId,
      });

    store.set(
      state.minuteSheetFormSnapshot,
      currentMinuteSheetFormStateSnapshot,
    );
  }
};
