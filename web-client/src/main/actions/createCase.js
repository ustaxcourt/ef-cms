import { state } from 'cerebral';

export default async ({ applicationContext, get, store }) => {
  const user = get(state.user);
  const caseInitiator = get(state.petition);
  const useCases = applicationContext.getUseCases();

  const fileHasUploaded = () => {
    store.set(
      state.petition.uploadsFinished,
      get(state.petition.uploadsFinished) + 1,
    );
  };

  const {
    petitionDocument,
    requestForPlaceOfTrialDocument,
    statementOfTaxpayerIdentificationNumberDocument,
  } = await useCases.uploadCasePdfs({
    applicationContext,
    caseInitiator,
    user,
    fileHasUploaded,
  });

  await useCases.createCase({
    applicationContext,
    documents: [
      petitionDocument,
      requestForPlaceOfTrialDocument,
      statementOfTaxpayerIdentificationNumberDocument,
    ],
    userId: user.userId,
  });
};
