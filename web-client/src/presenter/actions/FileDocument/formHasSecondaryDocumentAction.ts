import { state } from 'cerebral';

/**
 * returns path.yes if the state.form has a secondaryDocument
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} continue path for the sequence
 */
export const formHasSecondaryDocumentAction = ({ get, path }: ActionProps) => {
  const secondaryDocument = get(state.form.secondaryDocument);

  if (secondaryDocument && secondaryDocument.documentType) {
    return path.yes();
  } else {
    return path.no();
  }
};
