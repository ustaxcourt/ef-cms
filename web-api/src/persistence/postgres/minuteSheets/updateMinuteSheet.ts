import { MinuteSheet } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';
import { getDbWriter } from '@web-api/persistence/postgres/database';
import { OPENSEARCH_SYNC_ACTIONS } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const upsertMinuteSheet = async ({
  minuteSheetToUpsert,
}: {
  minuteSheetToUpsert: {
    trialSessionId: string;
    docketNumber: string;
    content: MinuteSheet;
  };
}) => {
  const newOrUpdatedMinuteSheet = await getDbWriter({
    cb: writer =>
      writer
        .insertInto('dwMinuteSheet')
        .values({
          content: minuteSheetToUpsert.content,
          docketNumber: minuteSheetToUpsert.docketNumber,
          trialSessionId: minuteSheetToUpsert.trialSessionId,
        })
        .returning(['content', 'docketNumber', 'trialSessionId'])
        .onConflict(oc =>
          oc.columns(['docketNumber', 'trialSessionId']).doUpdateSet({
            content: minuteSheetToUpsert.content,
          }),
        )
        .executeTakeFirst(),
    table: 'dwMinuteSheet',
    action: OPENSEARCH_SYNC_ACTIONS.UPSERT,
  });

  return transformNullToUndefined(newOrUpdatedMinuteSheet) as {
    trialSessionId: string;
    docketNumber: string;
    content: MinuteSheet;
  };
};
