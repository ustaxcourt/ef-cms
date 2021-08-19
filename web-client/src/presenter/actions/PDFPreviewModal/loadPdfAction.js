import { state } from 'cerebral';

/**
 * loads the pdf for being used in preview modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {Function} providers.props the cerebral props object
 * @returns {Promise} promise which resolves if it successfully loads the pdf
 */
export const loadPdfAction = ({ applicationContext, props, router, store }) => {
  const { file } = props;
  const isBase64Encoded = typeof file === 'string' && file.startsWith('data');

  store.set(state.modal.pdfPreviewModal, {});

  return new Promise((resolve, reject) => {
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
        const pdfDataUri = router.createObjectURL(
          new Blob([binaryFile], { type: 'application/pdf' }),
        );
        store.set(state.pdfPreviewUrl, pdfDataUri);
        store.unset(state.modal.pdfPreviewModal.error);
        resolve();
      } catch (err) {
        store.set(state.modal.pdfPreviewModal.error, err);
        reject(err);
      }
    };

    reader.onerror = function (err) {
      store.set(state.modal.pdfPreviewModal.error, err);
      reject(err);
    };

    if (isBase64Encoded) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};
