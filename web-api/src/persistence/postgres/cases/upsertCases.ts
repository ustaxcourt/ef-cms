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
          const keys = Object.keys(casesToUpsert[0]!) as any[];
          return Object.fromEntries(keys.map(key => [key, c.ref(key)]));
        }),
      )
      .execute(),
  );
};
