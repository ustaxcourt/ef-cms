import { getDbWriter } from '@web-api/database';

export const setPriorityOnAllWorkItems = async ({
  docketNumber,
  highPriority,
}: {
  docketNumber: string;
  highPriority: boolean;
}) => {
  await getDbWriter(writer => {
    let builder = writer
      .updateTable('dwWorkItem')
      .set('highPriority', highPriority);

    return builder.where('docketNumber', '=', docketNumber).execute();
  });
};
