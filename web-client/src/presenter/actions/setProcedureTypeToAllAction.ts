import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the procedure type filter to 'All'
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const setProcedureTypeToAllAction = ({ store }: ActionProps) => {
  store.set(state.form.procedureType, 'All');
};
