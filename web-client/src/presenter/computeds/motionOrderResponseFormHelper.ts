import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
export const motionOrderResponseFormHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { DATE_FORMATS } = applicationContext.getConstants();
  const { status } = get(state.caseDetail);
  const showStrikeCheckBox = status === CASE_STATUS_TYPES.calendared;

  const minDate = applicationContext
    .getUtilities()
    .formatNow(DATE_FORMATS.YYYYMMDD);

  return {
    minDate,
    showStrikeCheckBox,
  };
};
