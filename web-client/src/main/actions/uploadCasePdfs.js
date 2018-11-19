import { state } from 'cerebral';

// TODO: rename to upload to case initation PDFs (or something)
export default async ({ useCases, applicationContext, get, store }) => {
  const fileHasUploaded = () => {
    store.set(
      state.petition.uploadsFinished,
      get(state.petition.uploadsFinished) + 1,
    );
  };
  const uploadResults = await useCases.uploadCasePdfs(
    applicationContext,
    get(state.petition),
    get(state.user),
    fileHasUploaded,
  );
  return { uploadResults };
};
