import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * resets the state.form which is used throughout the app for storing html form values
 * state.form is used throughout the app for storing html form values
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const completeDocketEntryQCAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const documentId = get(state.documentId);
  const { overridePaperServiceAddress } = props;

  let entryMetadata = omit(
    {
      ...get(state.form),
    },
    ['workitems', 'dateReceivedMonth', 'dateReceivedDay', 'dateReceivedYear'],
  );

  entryMetadata = {
    ...entryMetadata,
    createdAt: entryMetadata.dateReceived,
    docketNumber,
    documentId,
    overridePaperServiceAddress,
    receivedAt: entryMetadata.dateReceived,
  };

  const {
    caseDetail,
    paperServiceDocumentTitle,
    paperServiceParties,
    paperServicePdfUrl,
  } = await applicationContext.getUseCases().completeDocketEntryQCInteractor({
    applicationContext,
    entryMetadata,
  });

  const updatedDocument = caseDetail.documents.filter(
    doc => doc.documentId === documentId,
  )[0];

  return {
    alertSuccess: {
      message: `${updatedDocument.documentTitle} has been completed.`,
      title: 'QC Completed',
    },
    caseDetail,
    docketNumber,
    paperServiceDocumentTitle,
    paperServiceParties,
    pdfUrl: paperServicePdfUrl,
    updatedDocument,
  };
};
