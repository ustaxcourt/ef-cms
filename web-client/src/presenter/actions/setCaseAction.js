import { state } from 'cerebral';

/**
 * sets the state.caseDetail which is used for displaying the red alerts at the top of the page.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.props the cerebral props object containing the props.caseDetail
 * @param {Object} providers.store the cerebral store used for setting the state.caseDetail
 */
export const setCaseAction = ({ store, props }) => {
  store.set(state.caseDetail, props.caseDetail);
};
