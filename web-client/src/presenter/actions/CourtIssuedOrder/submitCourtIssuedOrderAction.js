import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * sets the court issued order onto the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const submitCourtIssuedOrderAction = async ({
  applicationContext,
  get,
  props,
}) => {
  let caseDetail;
  const { docketNumber } = get(state.caseDetail);
  const { primaryDocumentFileId: docketEntryId } = props;
  const formData = get(state.form);
  const { docketEntryIdToEdit } = formData;

  let documentMetadata = omit(formData, [
    'primaryDocumentFile',
    'docketEntryIdToEdit',
  ]);

  documentMetadata = {
    ...documentMetadata,
    docketNumber,
  };

  documentMetadata.draftOrderState = {
    ...documentMetadata,
  };

  await applicationContext
    .getUseCases()
    .virusScanPdfInteractor(applicationContext, {
      key: docketEntryId,
    });

  await applicationContext
    .getUseCases()
    .validatePdfInteractor(applicationContext, {
      key: docketEntryId,
    });

  if (docketEntryIdToEdit) {
    caseDetail = await applicationContext
      .getUseCases()
      .updateCourtIssuedOrderInteractor(applicationContext, {
        docketEntryIdToEdit,
        documentMetadata,
      });
  } else {
    caseDetail = await applicationContext
      .getUseCases()
      .fileCourtIssuedOrderInteractor(applicationContext, {
        documentMetadata,
        primaryDocumentFileId: docketEntryId,
      });
  }

  return {
    caseDetail,
    docketEntryId,
    docketNumber,
    eventCode: documentMetadata.eventCode,
  };
};
