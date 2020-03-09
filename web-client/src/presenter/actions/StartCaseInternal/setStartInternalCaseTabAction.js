import { state } from 'cerebral';

/**
 * sets startInternalCase tab to props tab
 *
 * @param {object} providers the providers object
 * @param {Function} providers.props the cerebral props object used for passing in props.caseCaption
 * @param {Function} providers.store the cerebral store used for setting the state.form.caseCaption
 */
export const setStartInternalCaseTabAction = ({ props, store }) => {
  store.set(state.startCaseInternal.tab, props.tab);
};
