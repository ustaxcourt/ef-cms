import { orderBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { WorkItemAbomination } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';

export const setWorkItemsAction = ({
  props,
  store,
}: ActionProps<{ workItems: WorkItemAbomination[] }>) => {
  const orderedWorkItems = orderBy(props.workItems, 'updatedAt', 'desc');
  store.set(state.workQueue, orderedWorkItems);
};
