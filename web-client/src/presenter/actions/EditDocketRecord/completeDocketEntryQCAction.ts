import { omit } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const completeDocketEntryQCAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const { docketNumber, leadDocketNumber } = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  const { qcCompletionAndMessageFlag } = props;
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
    selectedSection,
  };

  try {
    const {
      caseDetail,
      paperServiceDocumentTitle,
      paperServiceParties,
      paperServicePdfUrl,
    } = (await applicationContext
      .getUseCases()
      .completeDocketEntryQCInteractor(applicationContext, {
        entryMetadata,
      })) as {
      caseDetail: RawCase;
      paperServiceDocumentTitle: string;
      paperServiceParties: string[];
      paperServicePdfUrl: string;
    };

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
      docketEntryId,
    });
  } catch (error) {
    return path.error({
      error,
    });
  }
};
