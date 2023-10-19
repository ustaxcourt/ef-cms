import { state } from '@web-client/presenter/app.cerebral';

export const openSelectedPDFsSequence = [
  async ({ applicationContext, get }) => {
    const { selectedPdfs } = get(state.form);
    console.log(selectedPdfs);

    let allUrls: string[] = [];
    for (const documentId of selectedPdfs) {
      const { url } = await applicationContext
        .getUseCases()
        .getPaperServicePdfUrlInteractor(applicationContext, {
          key: documentId,
        });

      allUrls.push(url);
    }

    await Promise.all(
      allUrls.map(url =>
        applicationContext.getUtilities().openUrlInNewTab({ url }),
      ),
    );
  },
];
