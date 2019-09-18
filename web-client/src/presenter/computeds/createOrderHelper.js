import { state } from 'cerebral';

export const createOrderHelper = get => {
  const documentToEdit = get(state.documentToEdit);
  const isEditing = !!documentToEdit;
  const { documentTitle } = get(state.form);

  const pageTitle = isEditing
    ? `Edit ${documentTitle}`
    : `Create ${documentTitle}`;

  return {
    documentToEdit,
    isEditing,
    pageTitle,
  };
};
