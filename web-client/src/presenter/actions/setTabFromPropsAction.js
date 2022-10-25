import { state } from 'cerebral';

/**
 * sets the tab from the provided props
 *
 * @param {string} props the props containing the tab to select
 * @param {string} store the cerebral store
 */
export const setTabFromPropsAction = ({ props, store }) => {
  if (props.tab) {
    store.set(state.currentViewMetadata.tab, props.tab);
  }
};
