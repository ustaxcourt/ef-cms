import { state } from 'cerebral';

/**
 * sets the correspondence id to display
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setCorrespondenceIdToDisplayAction = ({ props, store }) => {
  store.set(state.correspondenceId, props.correspondenceId);
};
