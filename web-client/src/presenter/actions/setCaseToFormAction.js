import { state } from 'cerebral';

/**
 * sets the state.form from props.caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.form
 */
export const setCaseToFormAction = ({ props, store }) => {
  store.set(state.form, props.caseDetail);
};
