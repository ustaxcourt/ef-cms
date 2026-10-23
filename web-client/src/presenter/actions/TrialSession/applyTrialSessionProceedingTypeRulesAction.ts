import { REPORTING_SESSION_EXCLUDED_FIELDS } from '@shared/business/entities/trialSessions/TrialSession';
import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const applyTrialSessionProceedingTypeRulesAction = ({
  get,
  props,
  store,
}: ActionProps<{ key: string }>): void => {
  const form = get(state.form);
  const isReporting =
    form.proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.reporting;

  if (props.key !== 'proceedingType' && !isReporting) return;

  for (const field of REPORTING_SESSION_EXCLUDED_FIELDS) {
    if (!isReporting && field === 'swingSessionId') continue;
    store.unset(state.form[field]);
  }
  for (const field of [
    'startTimeHours',
    'startTimeMinutes',
    'startTimeExtension',
  ]) {
    store.unset(state.form[field]);
  }

  if (isReporting) {
    store.set(state.form.estimatedEndDate, form.startDate);
    store.unset(state.form.swingSession);
    store.set(state.form.sessionScope, TRIAL_SESSION_SCOPE_TYPES.locationBased);
    if (
      [SESSION_TYPES.special, SESSION_TYPES.motionHearing].includes(
        form.sessionType,
      )
    ) {
      store.unset(state.form.sessionType);
    }
  } else {
    store.set(state.form.startTime, '10:00');
    store.set(state.form.startTimeHours, '10');
    store.set(state.form.startTimeMinutes, '00');
    store.set(state.form.startTimeExtension, 'am');
  }
};
