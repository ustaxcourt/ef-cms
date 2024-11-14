import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { deleteByGsi } from '../helpers/deleteByGsi';

export const deleteWorkItem = ({
  applicationContext,
  workItem,
}: {
  applicationContext: IApplicationContext;
  workItem: RawWorkItem;
}) =>
  deleteByGsi({
    applicationContext: applicationContext as ServerApplicationContext,
    gsi: `work-item|${workItem.workItemId}`,
  });
