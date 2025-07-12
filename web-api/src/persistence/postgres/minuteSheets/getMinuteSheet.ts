import { getDbReader } from '@web-api/persistence/postgres/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { MinuteSheet } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

export const getMinuteSheet = async ({
  docketNumber,
  trialSessionId,
}: {
  docketNumber: string;
  trialSessionId: string;
}) => {
  const minuteSheet = await getDbReader(writer =>
    writer
      .selectFrom('dwMinuteSheet')
      .selectAll()
      .where('docketNumber', '=', docketNumber)
      .where('trialSessionId', '=', trialSessionId)
      .executeTakeFirst(),
  );

  if (minuteSheet) {
    return transformNullToUndefined(minuteSheet) as {
      docketNumber: string;
      trialSessionId: string;
      content: MinuteSheet;
    };
  } else {
    return undefined;
  }
};
