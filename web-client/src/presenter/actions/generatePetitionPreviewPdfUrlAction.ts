import { state } from '@web-client/presenter/app.cerebral';

export const generatePetitionPreviewPdfUrlAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const petitionFormatted = get(state.petitionFormatted);
  if (petitionFormatted.corporateDisclosureFile) {
    const url = await generatePdfUrl(
      petitionFormatted.corporateDisclosureFile,
      applicationContext,
    );
    store.set(state.petitionFormatted.corporateDisclosureFileUrl, url);
  }

  if (petitionFormatted.stinFile) {
    const url = await generatePdfUrl(
      petitionFormatted.stinFile,
      applicationContext,
    );
    store.set(state.petitionFormatted.stinFileUrl, url);
  }

  if (petitionFormatted.irsNotices && petitionFormatted.irsNotices.length) {
    petitionFormatted.irsNotices.forEach(async (irsNotice, index) => {
      if (irsNotice.file) {
        const url = await generatePdfUrl(irsNotice.file, applicationContext);
        store.set(
          state.petitionFormatted.irsNotices![index].irsNoticeFileUrl,
          url,
        );
      }
    });
  }
};

function generatePdfUrl(file, applicationContext) {
  const isBase64Encoded = typeof file === 'string' && file.startsWith('data');

  return new Promise(resolve => {
    const reader = applicationContext.getFileReaderInstance();

    reader.onload = () => {
      let binaryFile;
      if (isBase64Encoded) {
        const base64File = reader.result.replace(/[^,]+,/, '');
        binaryFile = atob(base64File);
      } else {
        binaryFile = reader.result;
      }
      try {
        const pdfDataUri = URL.createObjectURL(
          new Blob([binaryFile], { type: 'application/pdf' }),
        );
        resolve(pdfDataUri);
      } catch (err) {
        resolve('');
      }
    };

    reader.onerror = function () {
      resolve('');
    };

    if (isBase64Encoded) {
      reader.readAsDataURL(new Blob([file], { type: 'application/pdf' }));
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
}
