import { MOTION_DISPOSITIONS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const clearGrantDenyMotionDependentFieldsAction = ({
  props,
  store,
}: ActionProps) => {
  if (
    props.key === 'dueDateMessage' &&
    (props.value === null || props.value === undefined || props.value === '')
  ) {
    store.unset(state.form.dueDate);
    store.unset(state.form.filingParty);
  }

  if (props.key === 'strickenFromTrialSession' && !props.value) {
    store.unset(state.form.jurisdiction);
  }

  if (
    props.key === 'disposition' &&
    props.value !== MOTION_DISPOSITIONS.DENIED
  ) {
    store.unset(state.form.deniedAsMoot);
    store.unset(state.form.deniedWithoutPrejudice);
  }
};
