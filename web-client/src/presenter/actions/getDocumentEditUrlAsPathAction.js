import { getDocumentEditUrl } from '../utilities/getDocumentEditUrl';
import { state } from 'cerebral';

/**
 * returns the editUrl as path for the document in props.documentIdToEdit
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {object} the next path to take
 */
export const getDocumentEditUrlAsPathAction = ({
  applicationContext,
  get,
  props,
}) => {
  const { caseDetail, documentIdToEdit } = props;
  const parentMessageId = get(state.parentMessageId);

  if (documentIdToEdit) {
    const documentToEdit = caseDetail.documents.find(
      document => document.documentId === documentIdToEdit,
    );

    let editUrl = getDocumentEditUrl({
      applicationContext,
      caseDetail,
      document: documentToEdit,
    });

    if (parentMessageId) {
      editUrl += `/${parentMessageId}`;
    }

    return {
      path: editUrl,
    };
  }
};
