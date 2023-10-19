import { state } from '@web-client/presenter/app.cerebral';

export const openSelectedPDFsSequence = [
  async ({ applicationContext, get }) => {
    const { selectedPdfs } = get(state.form);

    await Promise.all(
      selectedPdfs.map(documentId =>
        getUrlAndOpenInNewTab(applicationContext, documentId),
      ),
    );
  },
];

const getUrlAndOpenInNewTab = async (applicationContext, documentId) => {
  const { url } = await applicationContext
    .getUseCases()
    .getPaperServicePdfUrlInteractor(applicationContext, {
      key: documentId,
    });

  await applicationContext.getUtilities().openUrlInNewTab({ url });
};
