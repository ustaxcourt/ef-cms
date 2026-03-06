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
      paperServiceDocumentTitle,
      paperServiceParties,
      paperServicePdfUrl,
    } = (await applicationContext
      .getUseCases()
      .completeDocketEntryQCInteractor(applicationContext, {
        entryMetadata,
      })) as {
      paperServiceDocumentTitle: string;
      paperServiceParties: any[];
      paperServicePdfUrl: string;
    };

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
    });
  } catch (error) {
    return path.error({
      error,
    });
  }
};
