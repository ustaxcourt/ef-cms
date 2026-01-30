import { Stamp } from '../../../../shared/src/business/entities/Stamp';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * generates an action for completing motion stamping
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {Function} the action to complete the motion stamping
 */
export const completeMotionStampingAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const motionDocketEntryId = get(state.pdfForSigning.docketEntryId);
  const { docketNumber } = get(state.caseDetail);
  const parentMessageId = get(state.parentMessageId);
  const stampFormData = get(state.form);

  const newDocketEntryId = applicationContext.getUniqueId();

  const { nameForSigning, nameForSigningLine2 } = get(state.pdfForSigning);

  const stampEntity = new Stamp(stampFormData);
  const stampData = {
    ...stampEntity,
    nameForSigning,
    nameForSigningLine2,
  };

  await applicationContext
    .getUseCases()
    .generateDraftStampOrderInteractor(applicationContext, {
      docketNumber,
      formattedDraftDocumentTitle: props.formattedDraftDocumentTitle,
      motionDocketEntryId,
      parentMessageId,
      stampData,
      stampedDocketEntryId: newDocketEntryId,
    });

  let redirectUrl;
  if (parentMessageId) {
    redirectUrl = `/messages/${docketNumber}/message-detail/${parentMessageId}?documentId=${newDocketEntryId}`;
  } else {
    redirectUrl = `/case-detail/${docketNumber}/draft-documents?docketEntryId=${newDocketEntryId}`;
  }

  return {
    docketEntryId: newDocketEntryId,
    docketNumber,
    redirectUrl,
    tab: 'docketRecord',
  };
};
