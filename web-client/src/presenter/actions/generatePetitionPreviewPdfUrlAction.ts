import { state } from '@web-client/presenter/app.cerebral';

export const generatePetitionPreviewPdfUrlAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const petitionFormatted = get(state.petitionFormatted);

  const KEYS = ['corporateDisclosureFile', 'stinFile', 'petitionFile'];
  for (let index = 0; index < KEYS.length; index++) {
    const key = KEYS[index];
    if (!petitionFormatted[key]) continue;

    const url = await generatePdfUrl(
      petitionFormatted[key],
      applicationContext,
    );

    const stateKey = `${key}Url`;
    store.set(state.petitionFormatted[stateKey], url);
  }

  if (!petitionFormatted.hasIrsNotice || !petitionFormatted.irsNotices?.length)
    return;

  petitionFormatted.irsNotices.forEach(async (irsNotice, index) => {
    if (!irsNotice.file) return;
    const url = await generatePdfUrl(irsNotice.file, applicationContext);
    store.set(state.petitionFormatted.irsNotices![index].irsNoticeFileUrl, url);
  });
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
