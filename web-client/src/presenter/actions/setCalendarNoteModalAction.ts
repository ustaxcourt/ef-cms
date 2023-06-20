import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.modal.note from props.note
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store used for setting the state.caseDetail
 */
export const setCalendarNoteModalAction = ({ props, store }: ActionProps) => {
  const { note } = props;
  store.set(state.modal.note, note);
  store.set(state.modal.trialSessionId, props.trialSessionId);
  store.set(state.modal.isEditing, !!note);
};
