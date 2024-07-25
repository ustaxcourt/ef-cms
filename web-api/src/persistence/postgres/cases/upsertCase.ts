import { db } from '@web-api/database';

export const upsertCase = async ({ rawCase }: { rawCase: RawCase }) => {
  const caseToUpsert = {
    docketNumber: rawCase.docketNumber,
    docketNumberSuffix: rawCase.docketNumberSuffix,
    trialDate: rawCase.trialDate,
    trialLocation: rawCase.trialLocation,
  };
  await db
    .insertInto('case')
    .values(caseToUpsert)
    .onConflict(oc => oc.column('docketNumber').doUpdateSet(caseToUpsert))
    .execute();
};
