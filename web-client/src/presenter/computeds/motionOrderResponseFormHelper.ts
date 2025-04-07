import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
export const motionOrderResponseFormHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { DATE_FORMATS } = applicationContext.getConstants();
  const form = get(state.form);
  const { status } = get(state.caseDetail);
  const showStrikeCheckBox = status === CASE_STATUS_TYPES.calendared;

  const { customText } = form;

  const CUSTOM_ORDER_MAX_LENGTH = 60;
  const customOrderTextCharacterCount = customText?.length
    ? CUSTOM_ORDER_MAX_LENGTH - customText?.length
    : CUSTOM_ORDER_MAX_LENGTH;

  // TODO 10586: fix this
  const canSaveOrderRespones =
    !!form.disposition && get(state.pdfForSigning.stampApplied);

  const minDate = applicationContext
    .getUtilities()
    .formatNow(DATE_FORMATS.YYYYMMDD);

  const validationErrors = get(state.validationErrors);
  const dateErrorClass = !validationErrors.date
    ? 'order-response-form-group'
    : 'order-response-form-group-error';

  const dispositionErrorClass = !validationErrors.disposition
    ? 'order-response-form-group'
    : 'order-response-form-group-error';

  return {
    canSaveOrderRespones,
    customOrderTextCharacterCount,
    dateErrorClass,
    dispositionErrorClass,
    minDate,
    showStrikeCheckBox,
  };
};
