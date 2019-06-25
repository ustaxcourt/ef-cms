import { state } from 'cerebral';

/**
 * given a PDF document, returns a pdf.js object
 *
 * @param {object} providers the providers object
 * @param {Function} providers.props used for getting the canvas ref
 * @param {Function} providers.store the cerebral store used for setting state.pdfForSigning.canvas

 */
export const setCanvasForPDFSigningAction = async ({ props, store }) => {
  const { canvasRef } = props;
  store.set(state.pdfForSigning.canvas, canvasRef);
};
