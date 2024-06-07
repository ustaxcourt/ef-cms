import { X_FORCE_REFRESH } from '@shared/utils/headers';
import { state } from '@web-client/presenter/app.cerebral';

export const clearModalAction = ({ props, store }: ActionProps) => {
  if (
    props.error?.originalError?.response?.headers?.get(X_FORCE_REFRESH) !==
    'true'
  ) {
    store.unset(state.modal.showModal);
  }
};
