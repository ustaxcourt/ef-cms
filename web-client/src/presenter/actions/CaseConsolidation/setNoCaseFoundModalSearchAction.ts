import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the state error
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const setNoCaseFoundModalSearchAction = ({ store }: ActionProps) => {
  store.set(state.modal.error, 'No Case Found');
  store.unset(state.modal.caseDetail);
};
