import { state } from '@web-client/presenter/app.cerebral';

export const openSelectedPDFsSequence = [
  async ({ applicationContext, get }) => {
    const { selectedPdfs } = get(state.form);

    for (const documentId of selectedPdfs) {
      const { url } = await applicationContext
        .getUseCases()
        .getPaperServicePdfUrlInteractor(applicationContext, {
          key: documentId,
        });

      await applicationContext.getUtilities().openUrlInNewTab({ url });
    }
  },
];
