import { DateTime } from 'luxon';
import { state } from '@web-client/presenter/app.cerebral';

export const setTimeStampAction =
  ({ propertyName }: { propertyName: string }) =>
  ({ store }: ActionProps) => {
    store.set(state[propertyName], DateTime.now().setZone('America/New_York'));
  };
