import { openUrlInNewTab } from '../../utilities/openUrlInNewTab';
export const loadPdfForTabAction = ({
  applicationContext,
  props,
  router,
}: ActionProps) => {
  const { file } = props;
  const isBase64Encoded = typeof file === 'string' && file.startsWith('data');

  return new Promise<void>((resolve, reject) => {
    const reader = applicationContext.getFileReaderInstance();

    reader.onload = () => {
      let binaryFile: string | ArrayBuffer | null;
      if (isBase64Encoded && reader.result === 'string') {
        const base64File = reader.result.replace(/[^,]+,/, '');
        binaryFile = atob(base64File);
      } else {
        binaryFile = reader.result;
      }

      try {
        const pdfDataUri = router.createObjectURL(
          // @ts-ignore
          new Blob([binaryFile], { type: 'application/pdf' }),
        );
        openUrlInNewTab({ url: pdfDataUri });
        resolve();
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(err);
      }
    };

    reader.onerror = function (err) {
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      reject(err);
    };

    if (isBase64Encoded) {
      // @ts-ignore
      reader.readAsDataURL(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};
