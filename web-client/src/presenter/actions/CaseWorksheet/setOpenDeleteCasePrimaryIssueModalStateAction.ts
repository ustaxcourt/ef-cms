import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the state for the add edit notes modal
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setOpenDeleteCasePrimaryIssueModalStateAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.modal.docketNumber, props.docketNumber);
  store.set(state.modal.notesLabel, 'This action cannot be undone');
};
