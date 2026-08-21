import { getDbReader } from '@web-api/persistence/postgres/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { MinuteSheet } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

export const getMinuteSheetsByTrialSession = async ({
  trialSessionId,
}: {
  trialSessionId: string;
}): Promise<
  Array<{
    docketNumber: string;
    trialSessionId: string;
    content: MinuteSheet;
  }>
> => {
  const minuteSheets = await getDbReader(reader =>
    reader
      .selectFrom('dwMinuteSheet')
      .selectAll()
      .where('trialSessionId', '=', trialSessionId)
      .execute(),
  );

  return minuteSheets.map(sheet => transformNullToUndefined(sheet)) as Array<{
    docketNumber: string;
    trialSessionId: string;
    content: MinuteSheet;
  }>;
};
