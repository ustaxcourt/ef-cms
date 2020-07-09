import { state } from 'cerebral';

/**
 * Invokes the path in the sequence based on whether the court issued document is a notice or not.
 * In the case of a notice, it sets some state for redirecting after save
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 * @returns {object} continue path for the sequence
 */
export const getShouldRedirectToSigningAction = ({
  applicationContext,
  path,
  props,
  store,
}) => {
  const { documentId, eventCode } = props;

  const { NOTICE_EVENT_CODES } = applicationContext.getConstants();

  const isNotice = NOTICE_EVENT_CODES.includes(eventCode);

  if (documentId && !isNotice) {
    return path.yes();
  }

  if (isNotice) {
    // notices should always redirect to document detail - this takes
    // advantage of getEditDocumentEntryPointAction
    store.set(state.editDocumentEntryPoint, 'DocumentDetail');
  }

  return path.no();
};
