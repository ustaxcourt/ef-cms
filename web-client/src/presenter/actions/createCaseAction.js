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

  await useCases.createCase({
    applicationContext,
    petition: get(state.form),
    documents: [{ documentType: 'Petition', documentId: petitionDocumentId }],
  });
};
