import { state } from 'cerebral';
/**
 * Initiates a print session for the named view
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const printViewAction = ({ get, props, store }) => {
  const { printView } = props;
  const referringView = get(state.currentPage);

  store.set(state.currentPage, printView);

  // Remove from the current event loop
  setTimeout(() => {
    window.print();
    // return to referring view
    store.set(state.currentPage, referringView);
  });
};
