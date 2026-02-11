#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';

const scriptConfig: ScriptConfig = {
  description: 'check for invalid multiDocketedOn arrays',
  environment: {
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const invalidMultiDocketedOnArrays = async () => {
  return await getDbReader(reader =>
    reader
      .selectFrom(
        reader
          .selectFrom('dwDocketEntry')
          .select([
            sql<string[]>`array_agg(docket_number order by docket_number)`.as(
              'multiDocketedOn',
            ),
          ])
          .groupBy('docketEntryId')
          .having(reader.fn.count('docketEntryId'), '>', 1)
          .as('subquery'),
      )
      .select('multiDocketedOn')
      .distinct()
      .execute(),
  );
};

// const invalidMultiDocketedOnArrays = async (docketEntries) => {
//   return await getDbReader(reader =>
//     reader
//       .selectFrom('dwDocketEntry')
//       .select([
//         'docketEntryId',
//         sql<string[]>`array_agg(docket_number order by docket_number)`.as(
//           'multiDocketedOn',
//         ),
//       ])
//       .groupBy('docketEntryId')
//       .having(reader.fn.count('docketEntryId'), '>', 1)
//       .execute(),
//   );
// };

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const docketEntries = await invalidMultiDocketedOnArrays();

  console.log('***Unique MultiDocketedOn Arrays: ', docketEntries);
  console.log(
    '***Unique MultiDocketedOn Arrays length: ',
    docketEntries.length,
  );
})();
