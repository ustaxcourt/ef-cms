import { state } from 'cerebral';

export default ({ store }) => {
  const EXPIRE_TIMEOUT_MS = 2000;
  setTimeout(() => {
    store.set(state.form.showSaveSuccess, false);
  }, EXPIRE_TIMEOUT_MS);
};
