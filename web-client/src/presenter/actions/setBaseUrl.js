import { state } from 'cerebral';

export default ({ store, applicationContext }) => {
  store.set(state.baseUrl, applicationContext.getBaseUrl());
};
