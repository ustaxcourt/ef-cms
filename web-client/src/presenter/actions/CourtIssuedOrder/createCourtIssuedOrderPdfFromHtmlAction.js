import { state } from 'cerebral';

/**
 * create File from Blob
 * A Blob() is almost a File() - it's just missing the two properties below which we will add
 * https://stackoverflow.com/questions/27159179/how-to-convert-blob-to-file-in-javascript/29390393
 *
 * @param {Blob} theBlob
 * @param {string} fileName
 * @returns {File} the new file
 */
function blobToFile(theBlob, fileName) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

/**
 * generate pdf url from html string
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @returns {object} the prop object with the pdf url
 */
export const createCourtIssuedOrderPdfFromHtmlAction = ({
  applicationContext,
  get,
}) => {
  const htmlString = get(state.form.richText);
  const documentTitle = get(state.form.documentTitle);

  if (!htmlString) {
    throw new Error('No markup found in documentHtml');
  }

  let pdfBlob = applicationContext
    .getUseCases()
    .createCourtIssuedOrderPdfFromHtml({
      applicationContext,
      htmlString,
    });

  const pdfUrl = window.URL.createObjectURL(pdfBlob);
  const pdfFile = blobToFile(pdfBlob, documentTitle);

  return { pdfFile, pdfUrl };
};
