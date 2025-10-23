#!/usr/bin/env -S npx ts-node --transpile-only

import { DateTime } from 'luxon';
import {
  type ScriptConfig,
  getJsTimeframeForYear,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';

const scriptConfig: ScriptConfig = {
  description:
    'count-event-codes-by-year - Count instances of documents with the ' +
    'given event code(s) filed within the given duration.',
  environment: {
    env: 'ENV',
  },
  parameters: {
    eventCodes: {
      commaDelimited: true,
      position: 0,
      required: true,
      transform: 'toUpperCase',
      type: 'string',
    },
    fiscal: {
      default: false,
      short: 'f',
      type: 'boolean',
    },
    stricken: {
      default: false,
      short: 's',
      type: 'boolean',
    },
    years: {
      default: [`${DateTime.now().toObject().year}`],
      multiple: true,
      short: 'y',
      transform: 'number',
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { eventCodes, fiscal, stricken, years } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  eventCodes: string[];
  fiscal: boolean;
  stricken: boolean;
  years: number[];
};

const getCountDocketEntriesByEventCodesAndYears = async ({
  eventCodes,
  fiscal,
  onlyNonStricken,
  years,
}: {
  eventCodes: string[];
  fiscal: boolean;
  onlyNonStricken: boolean;
  years?: number[];
}): Promise<number> => {
  const results: { count: number } = await getDbReader(async reader => {
    let query = reader
      .selectFrom('dwDocketEntry')
      .where('eventCode', 'in', eventCodes);
    if (onlyNonStricken) {
      query = query.where('isStricken', '!=', true);
    }
    if (years && years.length) {
      if (years.length === 1) {
        const { begin, end } = getJsTimeframeForYear({
          fiscal,
          year: `${years[0]}`,
        });
        query = query
          .where('receivedAt', '>=', begin)
          .where('receivedAt', '<', end);
      } else {
        query = query.where(qb =>
          qb.or(
            years.map(year => {
              const { begin, end } = getJsTimeframeForYear({
                fiscal,
                year: `${year}`,
              });
              return qb.and([
                qb('receivedAt', '>=', begin),
                qb('receivedAt', '<', end),
              ]);
            }),
          ),
        );
      }
    }
    query = query.select(reader.fn.countAll().as('count'));
    return (await query.executeTakeFirst()) as { count: number };
  });
  return results?.count || 0;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const ret = await getCountDocketEntriesByEventCodesAndYears({
    eventCodes,
    fiscal,
    onlyNonStricken: !stricken,
    years,
  });
  console.log(
    `Found ${ret} ${eventCodes.join(',')} documents filed in ${fiscal ? 'fy' : ''} ${years.join(',')}.`,
  );
})();
