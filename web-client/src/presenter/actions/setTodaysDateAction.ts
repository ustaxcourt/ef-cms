import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const setTodaysDateAction = ({
  applicationContext,
  store,
}: ActionProps) => {
  store.set(
    state.todaysDate,
    applicationContext.getUtilities().formatNow(FORMATS.YYYYMMDD),
  );
};
