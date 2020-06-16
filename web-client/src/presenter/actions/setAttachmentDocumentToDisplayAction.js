import { state } from 'cerebral';

/**
 * sets the attachmentDocumentToDisplay from props
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setAttachmentDocumentToDisplayAction = ({ props, store }) => {
  const { attachmentDocumentToDisplay } = props;

  store.set(state.attachmentDocumentToDisplay, attachmentDocumentToDisplay);
};
