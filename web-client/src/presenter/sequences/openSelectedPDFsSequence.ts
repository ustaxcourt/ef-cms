import { state } from '@web-client/presenter/app.cerebral';

export const openSelectedPDFsSequence = [
  async ({ applicationContext, get }) => {
    const { selectedPdfs } = get(state.modal.form);

    await Promise.all(
      selectedPdfs.map(fileId =>
        getUrlAndOpenInNewTab(applicationContext, fileId),
      ),
    );
  },
];

const getUrlAndOpenInNewTab = async (applicationContext, fileId) => {
  const { url } = await applicationContext
    .getUseCases()
    .getPaperServicePdfUrlInteractor(applicationContext, {
      key: fileId,
    });

  await applicationContext.getUtilities().openUrlInNewTab({ url });
};
