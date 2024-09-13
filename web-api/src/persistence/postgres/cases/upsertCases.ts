import { getDbWriter } from '@web-api/database';

export const upsertCases = async (rawCases: RawCase[]) => {
  if (rawCases.length === 0) return;

  const casesToUpsert = rawCases.map(rawCase => ({
    docketNumber: rawCase.docketNumber,
    docketNumberSuffix: rawCase.docketNumberSuffix,
    leadDocketNumber: rawCase.leadDocketNumber,
    trialDate: rawCase.trialDate,
    trialLocation: rawCase.trialLocation,
  }));

  await getDbWriter(writer =>
    writer
      .insertInto('case')
      .values(casesToUpsert)
      .onConflict(oc =>
        oc.column('docketNumber').doUpdateSet(c => {
          return {
            docketNumberSuffix: c.ref('excluded.docketNumberSuffix'),
            leadDocketNumber: c.ref('excluded.leadDocketNumber'),
            trialDate: c.ref('excluded.trialDate'),
            trialLocation: c.ref('excluded.trialLocation'),
          };
        }),
      )
      .execute(),
  );
};
