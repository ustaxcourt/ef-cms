#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';

const scriptConfig: ScriptConfig = {
  description: 'storageId',
  environment: {
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const storageIds = async () => {
  return await getDbReader(reader =>
    reader
      .selectFrom(
        reader
          .selectFrom('dwDocketEntry')
          .select([
            'docketEntryId',
            'docketNumber',
            'documentStorageId',
            sql<number>`count(*) over (partition by docket_entry_id)`.as(
              'docketEntryCount',
            ),
            sql<string>`
                (
                  array_agg(docket_number) over (
                    partition by docket_entry_id
                    order by
                      case
                        when split_part(docket_number, '-', 2)::int >= 65
                          then 1900 + split_part(docket_number, '-', 2)::int
                        else 2000 + split_part(docket_number, '-', 2)::int
                      end,
                      split_part(docket_number, '-', 1)::int
                    rows between unbounded preceding and unbounded following
                  )
                )[1]
              `.as('originallyFiledDocketNumber'),
          ])
          .as('subquery'),
      )
      .select(['docketEntryId', 'docketNumber', 'documentStorageId'])
      .where('docketEntryCount', '>', 1)
      .where(eb =>
        eb('originallyFiledDocketNumber', '!=', eb.ref('docketNumber')),
      )
      .execute(),
  );
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const result = await storageIds();

  console.log('***recordsToUpdate: ', result);
  console.log('***recordsToUpdate length: ', result.length);
})();
