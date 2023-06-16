import { state } from '@web-client/presenter/app.cerebral';

/**
 * removeSecondarySupportingDocumentAction
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {undefined}
 */
export const removeSecondarySupportingDocumentAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { index } = props;

  const supportingDocuments =
    get(state.form.secondarySupportingDocuments) || [];
  supportingDocuments.splice(index, 1);
  const hasSupportingDocuments = !!supportingDocuments.length;

  store.set(state.form.hasSecondarySupportingDocuments, hasSupportingDocuments);
  store.set(state.form.secondarySupportingDocuments, supportingDocuments);
};
