import {
  X_FORCE_REFRESH,
  X_MANUAL_REFRESH_REQUIRED,
  getHeaderValue,
} from '@shared/utils/headers';
import { state } from '@web-client/presenter/app.cerebral';

export const clearModalAction = ({ props, store }: ActionProps) => {
  const refreshHeaderValue = getHeaderValue(
    props.error?.originalError?.response?.headers,
    X_FORCE_REFRESH,
  );
  const manualRefreshHeaderValue = getHeaderValue(
    props.error?.originalError?.response?.headers,
    X_MANUAL_REFRESH_REQUIRED,
  );

  if (refreshHeaderValue !== 'true' && manualRefreshHeaderValue !== 'true') {
    store.unset(state.modal.showModal);
  }
};
