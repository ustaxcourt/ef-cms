#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getDbReader, getDbWriter } from '@web-api/database';
import { OPENSEARCH_SYNC_ACTIONS } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { CompiledQuery } from 'kysely';

const scriptConfig: ScriptConfig = {
  description: 'Remove duplicated secondary contact service emails',
  environment: { env: 'ENV' },
  requireActiveAwsSession: true,
};

parseArgsAndEnvVars(scriptConfig);

const getCasesWithDuplicatedServiceEmail = async (): Promise<
  {
    docketNumber: string;
    petitioners: string;
  }[]
> => {
  return getDbReader(async db => {
    const result = await db.executeQuery<{
      docketNumber: string;
      petitioners: string; // Full petitioners array as JSON string
    }>(
      CompiledQuery.raw(
        `
          SELECT DISTINCT dc.docket_number, dc.petitioners::text
          FROM dw_case AS dc,
          jsonb_array_elements(dc.petitioners) AS petitioner_records
          WHERE dc.petitioners IS NOT NULL
          AND petitioner_records.value -> 'email' IS NOT NULL
          GROUP BY dc.docket_number, dc.petitioners, petitioner_records.value ->> 'email'
          HAVING count(1) > 1;
        `,
        [],
      ),
    );

    return result.rows;
  });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  let numberOfCasesUpdated = 0;
  const casesWithDuplicates = await getCasesWithDuplicatedServiceEmail();

  console.log(
    `Found ${casesWithDuplicates.length} cases with duplicated service emails.`,
  );

  for (const record of casesWithDuplicates) {
    const { docketNumber, petitioners } = record;
    console.log(`Case ${docketNumber} has duplicated service emails.`);

    const parsedPetitioners = JSON.parse(petitioners) as Array<{
      contactType: string;
      email?: string;
      serviceIndicator?: string;
    }>;

    if (!parsedPetitioners || parsedPetitioners.length < 2) {
      console.log(`Case ${docketNumber} doesn't have 2 petitioners, skipping.`);
      continue;
    }

    // We can naively assume that the first petitioner is the primary contact
    // and the second petitioner is the secondary contact.
    const primaryContact = parsedPetitioners[0];
    const secondaryContact = parsedPetitioners[1];

    if (secondaryContact && secondaryContact.email === primaryContact.email) {
      delete secondaryContact.email;
      secondaryContact.serviceIndicator = 'Paper';
      console.log(
        `Removed duplicated email from secondary contact in case ${docketNumber}
        and set secondary contact service indicator to 'Paper'.`,
      );

      await getDbWriter({
        cb: async db => {
          await db
            .updateTable('dwCase')
            .set({ petitioners: JSON.stringify(petitioners) })
            .where('docketNumber', '=', docketNumber)
            .execute();
        },
        table: 'dwCase',
        action: OPENSEARCH_SYNC_ACTIONS.UPSERT,
      });

      numberOfCasesUpdated++;
      console.log(`Updated case ${docketNumber}.`);
    }
  }

  console.log(`Updated ${numberOfCasesUpdated} cases in total.`);
})();
