import { deleteByGsi } from '../helpers/deleteByGsi';

export const deleteWorkItem = ({
  applicationContext,
  workItem,
}: {
  applicationContext: IApplicationContext;
  workItem: RawWorkItem;
}) =>
  deleteByGsi({ applicationContext, gsi: `work-item|${workItem.workItemId}` });
