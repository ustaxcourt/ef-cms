import { getDocumentEditUrl } from '../utilities/getDocumentEditUrl';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * returns the editUrl as path for the document in props.docketEntryIdToEdit
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {object|void} the next path to take
 */
export const getDocumentEditUrlAsPathAction = ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const { caseDetail, docketEntryIdToEdit } = props;
  const parentMessageId = get(state.parentMessageId);

  if (docketEntryIdToEdit) {
    const documentToEdit = caseDetail.docketEntries.find(
      document => document.docketEntryId === docketEntryIdToEdit,
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
