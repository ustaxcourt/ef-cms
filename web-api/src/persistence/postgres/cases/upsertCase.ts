import { dbWrite } from '@web-api/database';

export const upsertCase = async ({ rawCase }: { rawCase: RawCase }) => {
  const caseToUpsert = {
    docketNumber: rawCase.docketNumber,
    docketNumberSuffix: rawCase.docketNumberSuffix,
    leadDocketNumber: rawCase.leadDocketNumber,
    trialDate: rawCase.trialDate,
    trialLocation: rawCase.trialLocation,
  };
  await dbWrite
    .insertInto('case')
    .values(caseToUpsert)
    .onConflict(oc => oc.column('docketNumber').doUpdateSet(caseToUpsert))
    .execute();
};
