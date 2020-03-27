import { state } from 'cerebral';

/**
 * loads the pdf for being used in preview modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {Function} providers.props the cerebral props object
 * @returns {Promise} promise which resolves if it successfully loads the pdf
 */
export const loadPdfAction = ({ applicationContext, path, props, store }) => {
  const { ctx, file } = props;
  const isBase64Encoded = typeof file === 'string' && file.startsWith('data');

  store.set(state.modal.pdfPreviewModal, {});
  store.set(state.modal.pdfPreviewModal.ctx, ctx);

  return new Promise((resolve, reject) => {
    const reader = applicationContext.getFileReaderInstance();

    reader.onload = async () => {
      let binaryFile;
      if (isBase64Encoded) {
        const base64File = reader.result.replace(/[^,]+,/, '');
        binaryFile = atob(base64File);
      } else {
        binaryFile = reader.result;
      }

      try {
        const pdfJs = await applicationContext.getPdfJs();
        const pdfDoc = await pdfJs.getDocument({ data: binaryFile }).promise;

        store.set(state.modal.pdfPreviewModal.pdfDoc, pdfDoc);
        store.set(state.modal.pdfPreviewModal.totalPages, pdfDoc.numPages);
        store.set(state.modal.pdfPreviewModal.currentPage, 1);
        store.unset(state.modal.pdfPreviewModal.error);
        resolve(path.success());
      } catch (err) {
        store.set(state.modal.pdfPreviewModal.error, err);
        reject(path.error());
      }
    };

    reader.onerror = function (err) {
      store.set(state.modal.pdfPreviewModal.error, err);
      reject(path.error());
    };

    if (isBase64Encoded) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};
