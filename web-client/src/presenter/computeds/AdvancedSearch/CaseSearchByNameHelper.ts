import { ClientApplicationContext } from '@web-client/applicationContext';
import { FORMATS } from '../../../../../shared/src/business/utilities/DateHandler';
import { Get } from '../../../utilities/cerebralWrapper';

export const caseSearchByNameHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const today = applicationContext.getUtilities().formatNow(FORMATS.YYYYMMDD);

  return {
    today,
  };
};
