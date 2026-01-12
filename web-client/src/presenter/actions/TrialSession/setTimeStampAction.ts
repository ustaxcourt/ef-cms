import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const setTimeStampAction =
  ({ propertyName }: { propertyName: string }) =>
  ({ store }: ActionProps) => {
    const formattedEasternTimeStamp = formatNow(
      FORMATS.CURRENT_AS_OF_TIMESTAMP,
    );
    store.set(state[propertyName], formattedEasternTimeStamp);
  };
