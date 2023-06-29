import { state } from '@web-client/presenter/app.cerebral';

/**
 * removeSupportingDocumentAction
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {undefined}
 */
export const removeSupportingDocumentAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { index } = props;

  const supportingDocuments = get(state.form.supportingDocuments) || [];
  supportingDocuments.splice(index, 1);
  const hasSupportingDocuments = !!supportingDocuments.length;

  store.set(state.form.hasSupportingDocuments, hasSupportingDocuments);
  store.set(state.form.supportingDocuments, supportingDocuments);
};
