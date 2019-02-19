import { state } from 'cerebral';
import _ from 'lodash';

/**
 * sets the state.workQueue based on the props.workItems passed in.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.workQueue
 * @param {Object} providers.props the cerebral props object used for getting the props.workItems
 */
export default ({ store, props }) => {
  const orderedWorkItems = _.orderBy(props.workItems, 'updatedAt', 'desc');
  store.set(state.workQueue, orderedWorkItems);
};
