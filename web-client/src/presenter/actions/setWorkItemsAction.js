import { state } from 'cerebral';
import _ from 'lodash';

export default ({ store, props }) => {
  store.set(state.workQueue, _.orderBy(props.workItems, 'updatedAt', 'desc'));
};
