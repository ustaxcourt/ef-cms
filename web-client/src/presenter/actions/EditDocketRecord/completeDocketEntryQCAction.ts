import { omit } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * resets the state.form which is used throughout the app for storing html form values
 * state.form is used throughout the app for storing html form values
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const completeDocketEntryQCAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const { docketNumber, leadDocketNumber } = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  const { overridePaperServiceAddress, qcCompletionAndMessageFlag } = props;
  const selectedSection = get(state.workQueueToDisplay.section);

  let entryMetadata = omit(
    {
      ...get(state.form),
    },
    ['workitem'],
  );

  entryMetadata = {
    ...entryMetadata,
    createdAt: entryMetadata.receivedAt,
    docketEntryId,
    docketNumber,
    leadDocketNumber,
    overridePaperServiceAddress,
    selectedSection,
  };

  try {
    const {
      caseDetail,
      paperServiceDocumentTitle,
      paperServiceParties,
      paperServicePdfUrl,
    } = await applicationContext
      .getUseCases()
      .completeDocketEntryQCInteractor(applicationContext, {
        entryMetadata,
      });

    const updatedDocument = caseDetail.docketEntries.filter(
      doc => doc.docketEntryId === docketEntryId,
    )[0];

    const descriptionDisplay = applicationContext
      .getUtilities()
      .getDescriptionDisplay(updatedDocument);

    const qcCompletedAndSentMessage = `${descriptionDisplay} QC completed and message sent.`;
    const completedMessage = `${descriptionDisplay} has been completed.`;
    const message = qcCompletionAndMessageFlag
      ? qcCompletedAndSentMessage
      : completedMessage;

    return path.success({
      alertSuccess: {
        message,
        title: 'QC Completed',
      },
      caseDetail,
      docketNumber,
      paperServiceDocumentTitle,
      paperServiceParties,
      pdfUrl: paperServicePdfUrl,
      updatedDocument,
    });
  } catch (error) {
    return path.error({
      error,
    });
  }
};
