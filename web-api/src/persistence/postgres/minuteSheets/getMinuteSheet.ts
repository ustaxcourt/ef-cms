import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

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
      content: MinuteSheetFormState;
    };
  } else {
    return undefined;
  }
};
