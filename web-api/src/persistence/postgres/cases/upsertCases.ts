import { getDbWriter } from '@web-api/database';

export const upsertCases = async (rawCases: RawCase[]) => {
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
      .onConflict(oc => oc.column('docketNumber').doUpdateSet(casesToUpsert))
      .execute(),
  );
};
