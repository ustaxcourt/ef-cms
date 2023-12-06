import { FORMATS } from '../../../../../shared/src/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * defaults the start or end dates based on what is set when submitting the form
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.store the cerebral store used for setting state.advancedSearchForm.caseSearchByName
 */
export const defaultCaseSearchDatesAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const { endDate, startDate } = get(state.advancedSearchForm.caseSearchByName);

  if (endDate && !startDate) {
    store.set(
      state.advancedSearchForm.caseSearchByName.startDate,
      '05/01/1986',
    );
  }

  if (startDate && !endDate) {
    store.set(
      state.advancedSearchForm.caseSearchByName.endDate,
      applicationContext.getUtilities().formatNow(FORMATS.MMDDYYYY),
    );
  }
};
