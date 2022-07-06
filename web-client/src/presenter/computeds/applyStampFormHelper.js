import { state } from 'cerebral';

/**
 * gets the apply stamp form helper fields
 *
 * @param {Function} get the cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} apply stamp form helper fields
 */
export const applyStampFormHelper = get => {
  const form = get(state.form);
  const { customOrderText } = form;

  const CUSTOM_ORDER_MAX_LENGTH = 60;
  const customOrderTextCharacterCount = customOrderText?.length
    ? CUSTOM_ORDER_MAX_LENGTH - customOrderText?.length
    : CUSTOM_ORDER_MAX_LENGTH;

  const canSaveStampOrder = !!(
    form.status && get(state.pdfForSigning.stampApplied)
  );

  const pdfForSigning = get(state.pdfForSigning);
  const { isPdfAlreadySigned, stampApplied, stampData } = pdfForSigning;
  const cursorClass =
    !stampData && stampApplied ? 'cursor-grabbing ' : 'cursor-grab ';
  const hideClass = stampApplied && !isPdfAlreadySigned ? '' : 'hide';

  return {
    canSaveStampOrder,
    cursorClass,
    customOrderTextCharacterCount,
    stampClass: `${cursorClass} ${hideClass}`,
  };
};
