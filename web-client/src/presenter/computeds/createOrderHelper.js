import { state } from 'cerebral';

export const createOrderHelper = get => {
  const documentToEdit = get(state.documentToEdit);
  const isEditing = !!documentToEdit;

  return {
    documentToEdit,
    isEditing,
  };
};
