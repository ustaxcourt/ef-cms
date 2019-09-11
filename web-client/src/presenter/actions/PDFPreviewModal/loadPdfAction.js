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

  store.set(state.pdfPreviewModal.ctx, ctx);

  return new Promise((resolve, reject) => {
    const reader = new (applicationContext.getFileReader())();

    reader.onload = async () => {
      const base64File = reader.result.replace(/[^,]+,/, '');
      const binaryFile = atob(base64File);

      try {
        const pdfDoc = await applicationContext
          .getPdfJs()
          .getDocument({ data: binaryFile }).promise;

        store.set(state.pdfPreviewModal.pdfDoc, pdfDoc);
        store.set(state.pdfPreviewModal.totalPages, pdfDoc.numPages);
        store.set(state.pdfPreviewModal.currentPage, 1);
        store.unset(state.pdfPreviewModal.error);
        resolve(path.success());
      } catch (err) {
        store.set(state.pdfPreviewModal.error, err);
        reject(path.error());
      }
    };

    reader.onerror = function(err) {
      store.set(state.pdfPreviewModal.error, err);
      reject(path.error());
    };

    reader.readAsDataURL(file);
  });
};
