import { state } from '@web-client/presenter/app.cerebral';
import { updateMinuteSheetInteractor } from '@shared/proxies/trialSessionMinutes/updateMinuteSheetProxy';
import { transformFormStateToMinuteSheet } from './transformFormStateToMinuteSheet';
import hash from 'object-hash';

export const autosaveTrialSessionMinuteSheetAction = async ({
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
  let updateMinuteSheetFormState;
  if (hasFormChanged || forceAutosave) {
    const transformedMinuteSheet = transformFormStateToMinuteSheet(
      currentMinuteSheetFormState,
      trialSession.trialSessionId,
      caseDetail.docketNumber,
    );

    updateMinuteSheetFormState = await updateMinuteSheetInteractor({
      docketNumber: caseDetail.docketNumber,
      minuteSheet: transformedMinuteSheet,
      trialSessionId: trialSession.trialSessionId,
    });

    store.set(state.minuteSheetFormSnapshot, updateMinuteSheetFormState);
  }
};

