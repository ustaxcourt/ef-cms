import { state } from 'cerebral';
import { omit } from 'lodash';

export default async ({ applicationContext, get, store }) => {
  const user = get(state.user);
  const caseInitiator = omit(get(state.petition), 'uploadsFinished');
  const useCases = applicationContext.getUseCases();

  const fileHasUploaded = () => {
    store.set(
      state.petition.uploadsFinished,
      get(state.petition.uploadsFinished) + 1,
    );
  };

  const { petitionDocumentId, irsNoticeFileId } = await useCases.uploadCasePdfs(
    {
      applicationContext,
      caseInitiator,
      userId: user.userId,
      fileHasUploaded,
    },
  );

  const documents = [
    { documentType: 'Petition', documentId: petitionDocumentId },
  ];

  if (irsNoticeFileId) {
    documents.push({
      documentType: 'IRS Notice',
      documentId: irsNoticeFileId,
    });
  }

  const form = omit(
    {
      ...get(state.form),
      irsNoticeDate: get(state.startCaseHelper.irsNoticeDate),
    },
    ['year', 'month', 'day'],
  );

  await useCases.createCase({
    applicationContext,
    petition: form,
    documents,
  });
};
