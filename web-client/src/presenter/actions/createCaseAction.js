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

  const { petitionDocumentId } = await useCases.uploadCasePdfs({
    applicationContext,
    caseInitiator,
    userId: user.userId,
    fileHasUploaded,
  });

  const documents = [
    { documentType: 'Petition', documentId: petitionDocumentId },
  ];

  const form = omit(
    {
      ...get(state.form),
      irsNoticeDate: `${get(state.form.year)}-${get(state.form.month)}-${get(
        state.form.day,
      )}`,
    },
    ['year', 'month', 'day'],
  );

  await useCases.createCase({
    applicationContext,
    petition: form,
    documents,
  });
};
