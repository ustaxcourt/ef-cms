import { state } from 'cerebral';

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
