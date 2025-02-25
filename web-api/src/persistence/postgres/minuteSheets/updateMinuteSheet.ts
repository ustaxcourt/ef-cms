import { MinuteSheet } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { isEmpty } from 'lodash';

export const upsertMinuteSheet = async ({
  minuteSheetToUpsert,
}: {
  minuteSheetToUpsert: {
    trialSessionId: string;
    docketNumber: string;
    content: MinuteSheet;
  };
}) => {
  const newOrUpdatedMinuteSheet = await pgInsertInto({
    table: 'dwMinuteSheet',
    values: [
      {
        content: minuteSheetToUpsert.content,
        docketNumber: minuteSheetToUpsert.docketNumber,
        trialSessionId: minuteSheetToUpsert.trialSessionId,
      },
    ],
    onConflictColumns: ['docketNumber', 'trialSessionId'],
  });

  if (isEmpty(newOrUpdatedMinuteSheet)) {
    throw new Error('Failed to update minute sheet');
  }

  return transformNullToUndefined(newOrUpdatedMinuteSheet[0]) as {
    trialSessionId: string;
    docketNumber: string;
    content: MinuteSheet;
  };
};
