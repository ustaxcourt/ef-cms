import { pick } from 'lodash';
import { state } from 'cerebral';
/**
 * sets the state.screenMetadata.trialSessionFilters
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.query
 * @param {object} providers.store the cerebral store used for setting the state.screenMetadata.trialSessionFilters
 */
export const setTrialSessionsFiltersAction = ({ props, store }) => {
  store.set(
    state.screenMetadata.trialSessionFilters,
    pick(props.query, ['trialLocation', 'judge', 'sessionType', 'status']),
  );
};
