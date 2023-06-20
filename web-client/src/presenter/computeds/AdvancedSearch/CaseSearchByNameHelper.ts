import { ClientApplicationContext } from '@web-client/applicationContext';
import { FORMATS } from '../../../../../shared/src/business/utilities/DateHandler';

export const caseSearchByNameHelper = (
  applicationContext: ClientApplicationContext,
) => {
  const today = applicationContext.getUtilities().formatNow('MMDDYYYY');
  console.log('today:::::', today);

  return {
    today,
  };
};
