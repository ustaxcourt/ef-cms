import { getDbWriter } from '@web-api/database';

export const upsertCases = async (rawCases: RawCase[]) => {
  if (rawCases.length === 0) return;

  const casesToUpsert = rawCases.map(rawCase => ({
    caption: rawCase.caseCaption,
    docketNumber: rawCase.docketNumber,
    docketNumberSuffix: rawCase.docketNumberSuffix,
    leadDocketNumber: rawCase.leadDocketNumber,
    status: rawCase.status,
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
            caption: c.ref('excluded.caption'),
            docketNumberSuffix: c.ref('excluded.docketNumberSuffix'),
            leadDocketNumber: c.ref('excluded.leadDocketNumber'),
            status: c.ref('excluded.status'),
            trialDate: c.ref('excluded.trialDate'),
            trialLocation: c.ref('excluded.trialLocation'),
          };
        }),
      )
      .execute(),
  );
};
