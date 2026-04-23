import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

export const updateDocketEntryProcessingStatus = async ({
  docketEntryId,
  docketNumber,
  processingStatus,
}: {
  docketEntryId: string;
  docketNumber: string;
  processingStatus: string;
}) => {
  await pgUpdateTable({
    table: 'dwDocketEntry',
    values: { processingStatus },
    where: db =>
      db
        .where('docketEntryId', '=', docketEntryId)
        .where('docketNumber', '=', docketNumber),
  });
};
