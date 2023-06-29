import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the current practitioner document data for edit
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 * @returns {void} sets state for docket entry edit
 */
export const setPractitionerDocumentFormForEditAction = ({
  props,
  store,
}: ActionProps) => {
  const { barNumber, practitionerDocument } = props;

  store.set(state.form, practitionerDocument);
  store.set(state.form.existingFileName, practitionerDocument.fileName);
  store.set(state.form.barNumber, barNumber);
  store.set(state.form.isEditingDocument, true);
};
