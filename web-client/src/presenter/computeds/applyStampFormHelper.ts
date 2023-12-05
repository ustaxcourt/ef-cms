import { state } from '@web-client/presenter/app.cerebral';

/**
 * gets the apply stamp form helper fields
 *
 * @param {Function} get the cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} apply stamp form helper fields
 */
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const applyStampFormHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { DATE_FORMATS } = applicationContext.getConstants();
  const form = get(state.form);
  const pdfForSigning = get(state.pdfForSigning);

  const { customText } = form;
  const { isPdfAlreadyStamped, stampApplied } = pdfForSigning;

  const CUSTOM_ORDER_MAX_LENGTH = 60;
  const customOrderTextCharacterCount = customText?.length
    ? CUSTOM_ORDER_MAX_LENGTH - customText?.length
    : CUSTOM_ORDER_MAX_LENGTH;

  const canSaveStampOrder =
    !!form.disposition && get(state.pdfForSigning.stampApplied);

  const hideClass = stampApplied && !isPdfAlreadyStamped ? '' : 'hide';

  const minDate = applicationContext
    .getUtilities()
    .formatNow(DATE_FORMATS.YYYYMMDD);

  const validationErrors = get(state.validationErrors);
  const dateErrorClass = !validationErrors.date
    ? 'stamp-form-group'
    : 'stamp-form-group-error';

  const dispositionErrorClass = !validationErrors.disposition
    ? 'stamp-form-group'
    : 'stamp-form-group-error';

  return {
    canSaveStampOrder,
    customOrderTextCharacterCount,
    dateErrorClass,
    dispositionErrorClass,
    hideClass,
    minDate,
  };
};
