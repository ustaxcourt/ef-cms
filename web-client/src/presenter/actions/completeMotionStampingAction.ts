import { Stamp } from '../../../../shared/src/business/entities/Stamp';
import { state } from '@web-client/presenter/app.cerebral';

export const completeMotionStampingAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const motionDocketEntryId = get(state.pdfForSigning.docketEntryId);
  const { docketNumber } = get(state.caseDetail);
  const parentMessageId = get(state.parentMessageId);
  const stampFormData = get(state.form);

  const { nameForSigning, nameForSigningLine2 } = get(state.pdfForSigning);

  const stampEntity = new Stamp(stampFormData);
  const stampData = {
    ...stampEntity,
    nameForSigning,
    nameForSigningLine2,
  };

  const { stampedDocketEntryId } = await applicationContext
    .getUseCases()
    .generateDraftStampOrderInteractor(applicationContext, {
      docketNumber,
      formattedDraftDocumentTitle: props.formattedDraftDocumentTitle,
      motionDocketEntryId,
      parentMessageId,
      stampData,
    });

  let redirectUrl;
  if (parentMessageId) {
    redirectUrl = `/messages/${docketNumber}/message-detail/${parentMessageId}?documentId=${stampedDocketEntryId}`;
  } else {
    redirectUrl = `/case-detail/${docketNumber}/draft-documents?docketEntryId=${stampedDocketEntryId}`;
  }

  return {
    docketEntryId: stampedDocketEntryId,
    docketNumber,
    redirectUrl,
    tab: 'docketRecord',
  };
};
