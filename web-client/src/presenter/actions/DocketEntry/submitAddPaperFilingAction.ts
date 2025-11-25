import { omit } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const submitAddPaperFilingAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const { docketNumbers, isSavingForLater } = props;
  const { docketNumber } = get(state.caseDetail);
  const isFileAttachedNow = get(state.form.primaryDocumentFile);
  const clientConnectionId = get(state.clientConnectionId);
  const isFileAttached = get(state.form.isFileAttached) || isFileAttachedNow;

  const { documentStorageId } = props;

  let documentMetadata = omit(
    {
      ...get(state.form),
    },
    ['primaryDocumentFile'],
  );

  documentMetadata = {
    ...documentMetadata,
    createdAt: documentMetadata.receivedAt,
    docketNumber,
    isFileAttached: !!isFileAttached,
    isPaper: true,
  };

  await applicationContext
    .getUseCases()
    .addPaperFilingInteractor(applicationContext, {
      clientConnectionId,
      consolidatedGroupDocketNumbers: docketNumbers,
      documentStorageId,
      documentMetadata,
      isSavingForLater,
    });
};
