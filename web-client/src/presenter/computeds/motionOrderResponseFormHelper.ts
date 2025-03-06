import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const motionOrderResponseFormHelper = (
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

  // TODO 10586: fix this
  const canSaveOrderRespones =
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
    ? 'order-response-form-group'
    : 'order-response-form-group-error';

  return {
    canSaveOrderRespones,
    customOrderTextCharacterCount,
    dateErrorClass,
    dispositionErrorClass,
    hideClass,
    minDate,
  };
};
