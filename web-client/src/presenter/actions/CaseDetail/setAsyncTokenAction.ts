import { state } from '@web-client/presenter/app.cerebral';

export const setAsyncTokenAction = ({ get, store }: ActionProps) => {
  const token = get(state.token);
  store.set(state.asyncToken, `${Date.now()}__${token}`);
};
