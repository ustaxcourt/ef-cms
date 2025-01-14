import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import { getDbWriter } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const upsertMinuteSheet = async ({
  minuteSheetToUpsert,
}: {
  minuteSheetToUpsert: {
    trialSessionId: string;
    docketNumber: string;
    content: MinuteSheetFormState;
  };
}) => {
  const newOrUpdatedMinuteSheet = await getDbWriter(writer =>
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
  );

  return transformNullToUndefined(newOrUpdatedMinuteSheet) as {
    trialSessionId: string;
    docketNumber: string;
    content: MinuteSheetFormState;
  };
};
