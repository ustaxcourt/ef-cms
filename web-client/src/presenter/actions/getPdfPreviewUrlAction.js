import { state } from 'cerebral';
import jsPDF from 'jspdf';

/**
 * get the selected work items from state
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the selectedWorkItems
 * @returns {object} a list of selected work items
 */
export const getPdfPreviewUrlAction = async ({ get }) => {
  const htmlMarkup = get(state.form.richText);
  if (!htmlMarkup) {
    throw new Error('No markup found in documentHtml');
  }

  var pdf = new jsPDF('p', 'pt', 'letter');
  pdf.canvas.height = 72 * 11;
  pdf.canvas.width = 72 * 8.5;
  const [fromLeft, fromTop] = [15, 0];

  pdf.fromHTML(document.querySelector('.pdf-preview-div'), fromLeft, fromTop, {
    height: 500, // ?
    width: pdf.canvas.width - 72,
  });

  var blobUrl = pdf.output('datauristring');
  return { blobUrl };
};
