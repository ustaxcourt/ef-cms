import { state } from 'cerebral';

export default page => {
  return ({ store }) => {
    store.set(state.currentPage, page);
  };
};
