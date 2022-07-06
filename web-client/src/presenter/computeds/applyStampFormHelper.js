import { state } from 'cerebral';

/**
 * gets the apply stamp form helper fields
 *
 * @param {Function} get the cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} apply stamp form helper fields
 */
export const applyStampFormHelper = (get, applicationContext) => {
  const { DATE_FORMATS } = applicationContext.getConstants();
  const form = get(state.form);
  const pdfForSigning = get(state.pdfForSigning);

  const { customOrderText } = form;
  const { isPdfAlreadyStamped, stampApplied, stampData } = pdfForSigning;

  const CUSTOM_ORDER_MAX_LENGTH = 60;
  const customOrderTextCharacterCount = customOrderText?.length
    ? CUSTOM_ORDER_MAX_LENGTH - customOrderText?.length
    : CUSTOM_ORDER_MAX_LENGTH;

  const canSaveStampOrder =
    !!form.status && get(state.pdfForSigning.stampApplied);
  const cursorClass =
    !stampData && stampApplied ? 'cursor-grabbing' : 'cursor-grab';

  const hideClass = stampApplied && !isPdfAlreadyStamped ? '' : 'hide';

  const minDate = applicationContext
    .getUtilities()
    .formatNow(DATE_FORMATS.YYYYMMDD);

  return {
    canSaveStampOrder,
    cursorClass,
    customOrderTextCharacterCount,
    hideClass,
    minDate,
  };
};
