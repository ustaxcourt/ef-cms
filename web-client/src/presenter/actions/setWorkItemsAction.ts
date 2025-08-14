import { orderBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { RawWorkItemWithCaseAndDocketEntryInfo } from '@web-api/persistence/postgres/workitems/schema';

export const setWorkItemsAction = ({
  props,
  store,
}: ActionProps<{ workItems: RawWorkItemWithCaseAndDocketEntryInfo[] }>) => {
  const orderedWorkItems = orderBy(props.workItems, 'updatedAt', 'desc');
  store.set(state.workQueue, orderedWorkItems);
};
