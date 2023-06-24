import { orderBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.workQueue based on the props.workItems passed in.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext used for the getUniqueId method
 * @param {object} providers.store the cerebral store used for setting state.workQueue
 * @param {object} providers.props the cerebral props object used for getting the props.workItems
 * @returns {undefined}
 */
export const setWorkItemsAction = ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const orderedWorkItems = orderBy(props.workItems, 'updatedAt', 'desc').map(
    workItem => ({
      ...workItem,
      uiKey: applicationContext.getUniqueId(),
    }),
  );
  store.set(state.workQueue, orderedWorkItems);
};
