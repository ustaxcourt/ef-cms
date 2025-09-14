#!/usr/bin/env -S npx ts-node --transpile-only

import { type AuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { applicationContext } from '@web-api/applicationContext';
import { getDbReader } from '@web-api/database';
import { worker } from '@web-api/gateways/worker/worker';
import { DateTime } from 'luxon';
import {
  BRIEF_EVENTCODES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import {
  MESSAGE_TYPES,
  type WorkerMessage,
} from '@web-api/gateways/worker/workerRouter';

const scriptConfig: ScriptConfig = {
  description:
    'scrape-practitioner-briefs - Scrapes briefs that were filed by ' +
    'practitioners after the provided timestamp',
  environment: {
    ustcAdminUser: 'USTC_ADMIN_USER',
  },
  parameters: {
    startDateISO: {
      default: '2023-08-01T00:00:00Z',
      description: 'ISO-8601 timestamp of the start of the timeframe',
      position: 0,
      required: false,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { startDateISO, ustcAdminUser } = parseArgsAndEnvVars(scriptConfig) as {
  startDateISO: string;
  ustcAdminUser: string;
};
const start = DateTime.fromISO(startDateISO, { setZone: true });
if (!start.isValid) {
  throw new Error('startDateISO must be a valid ISO-8601 string');
}

const authorizedUser: AuthUser = {
  email: ustcAdminUser,
  name: ustcAdminUser.split('@')[0],
  role: 'docketclerk',
  userId: applicationContext.getUniqueId(),
};

type docketEntryType = {
  docketEntryId: string;
  docketNumber: string;
};

const findDocketEntriesToScrape = async (): Promise<docketEntryType[]> => {
  const results = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry as de')
      .leftJoin('dwCase as c', 'de.docketNumber', 'c.docketNumber')
      .select([
        'de.docketEntryId as docketEntryId',
        'de.docketNumber as docketNumber',
      ])
      .orderBy('de.servedAt', 'desc')
      .where('c.isSealed', '!=', true)
      .where('de.documentContentsId', 'is', null)
      .where('de.eventCode', 'in', BRIEF_EVENTCODES)
      .where('de.isFileAttached', '=', true)
      .where('de.isOnDocketRecord', '=', true)
      .where('de.isSealed', '!=', true)
      .where('de.isStricken', '!=', true)
      .where('de.filedByRole', 'in', [
        ROLES.irsPractitioner,
        ROLES.privatePractitioner,
      ])
      .where('de.receivedAt', '>=', start.toJSDate())
      .where('de.servedAt', 'is not', null)
      .limit(5000)
      .execute(),
  );
  return results as docketEntryType[];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const docketEntriesToScrape = await findDocketEntriesToScrape();
  console.log(`Found ${docketEntriesToScrape.length} docket entries to scrape`);

  for (const payload of docketEntriesToScrape) {
    const message: WorkerMessage = {
      authorizedUser,
      payload,
      type: MESSAGE_TYPES.SCRAPE_DOCUMENT_CONTENTS,
    };
    await worker(applicationContext, { message });
  }
  console.log(`Sent ${docketEntriesToScrape.length} messages to the queue`);
})();
