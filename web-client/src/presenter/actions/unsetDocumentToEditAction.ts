import { state } from '@web-client/presenter/app.cerebral';

/**
 * clear the value of state.documentToEdit
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const unsetDocumentToEditAction = ({ store }: ActionProps) => {
  store.unset(state.documentToEdit);
};
