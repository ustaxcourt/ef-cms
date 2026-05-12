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
      paperServiceDocumentTitle,
      paperServiceParties,
      paperServicePdfUrl,
    } = await applicationContext
      .getUseCases()
      .completeDocketEntryQCInteractor(applicationContext, {
        entryMetadata,
      });

    const form = get(state.form);
    const descriptionDisplay = applicationContext
      .getUtilities()
      .getDescriptionDisplay(form);

    const message = qcCompletionAndMessageFlag
      ? `${descriptionDisplay} QC completed and message sent.`
      : `${descriptionDisplay} has been completed.`;

    return path.success({
      alertSuccess: {
        message,
        title: 'QC Completed',
      },
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
