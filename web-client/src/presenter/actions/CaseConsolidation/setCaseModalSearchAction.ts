import { state } from 'cerebral';

/**
 * set the state from props
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setCaseModalSearchAction = ({ props, store }) => {
  const { caseDetail } = props;

  store.unset(state.modal.error);
  store.unset(state.modal.confirmSelection);
  store.set(state.modal.caseDetail, caseDetail);
};
