import { state } from 'cerebral';

/**
 * validates the case detail form and sets state.caseDetailErrors when errors occur.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting the state.caseDetailErrors when validation errors occur
 * @param {Object} providers.applicationContext the application context needed for getting the getUseCaseForDocumentUpload use case
 * @param {Object} providers.path the cerebral path which contains the next path in the sequence (path of success or failure)
 * @param {Object} providers.props the cerebral store used for getting the props.combinedCaseDetailWithForm
 * @returns {Object} the alertSuccess and the generated docketNumber
 */
export const validateWorkItemAction = ({ store, path, props, get }) => {
  const form = get(state.form)[props.workItemId];

  let errors = [];
  if (!form || !form.forwardRecipientId) {
    errors.push('Send To is a required field.');
  }
  if (!form || !form.forwardMessage) {
    errors.push('Message is a required field.');
  }
  store.set(state.messageErrors, errors || {});

  if (!errors.length) {
    return path.success({});
  } else {
    return path.error({ errors });
  }
};
