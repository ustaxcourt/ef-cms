import { state } from '@web-client/presenter/app.cerebral';

/**
 * clear the value of state.documentToEdit
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const unsetDocumentToEditAction = ({ props, store }: ActionProps) => {
  if (!props.isEditing) {
    store.unset(state.documentToEdit);
  }
};
