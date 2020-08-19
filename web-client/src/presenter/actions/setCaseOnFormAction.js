import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * sets props.caseDetail on state.form
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setCaseOnFormAction = async ({ props, store }) => {
  store.set(state.form, cloneDeep(props.caseDetail));
};
