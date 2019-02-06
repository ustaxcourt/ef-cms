import { state } from 'cerebral';
import _ from 'lodash';

export default ({ store, props }) => {
  const orderedWorkItems = _.orderBy(props.workItems, 'updatedAt', 'desc');
  store.set(state.workQueue, orderedWorkItems);
};
