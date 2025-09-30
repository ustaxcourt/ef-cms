#!/usr/bin/env -S npx ts-node --transpile-only

import { INITIAL_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';
import { getDbWriter } from '@web-api/database';
import { Database } from '@web-api/database-schema';
import { OPENSEARCH_SYNC_ACTIONS } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { Kysely } from 'kysely';
import {
  parseArgsAndEnvVars,
  ScriptConfig,
} from 'scripts/helpers/parseArgsAndEnvVars';

const scriptConfig: ScriptConfig = {
  description: 'update-document-type: This adds missing documentTypes',
  environment: {
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const EVENT_CODE_TO_DOC_TYPE: Record<string, string> = Object.values(
  INITIAL_DOCUMENT_TYPES,
).reduce(
  (acc, { eventCode, documentType }) => {
    if (eventCode && documentType) {
      acc[eventCode] = documentType;
    }
    return acc;
  },
  {} as Record<string, string>,
);

async function main() {
  const cb = async (db: Kysely<Database>) => {
    const trxResult = await db.transaction().execute(async trx => {
      let totalUpdated = 0;

      EVENT_CODE_TO_DOC_TYPE.NODC = 'Notice of Docket Change';

      for (const [eventCode, documentType] of Object.entries(
        EVENT_CODE_TO_DOC_TYPE,
      )) {
        const res = await trx
          .updateTable('dwDocketEntry')
          .set({ documentType })
          // .selectFrom('dwDocketEntry')
          // .select([
          //   'docketEntryId',
          //   'eventCode',
          //   'documentType',
          //   'docketNumber',
          // ])
          .where('documentType', 'is', null)
          .where('isDraft', 'is', false)
          .where('eventCode', '=', eventCode)
          .execute();

        console.log('res', res);

        const rowCount =
          (res as unknown as { numUpdatedRows?: bigint | number })
            ?.numUpdatedRows ?? 0;
        totalUpdated += Number(rowCount);
      }

      return { totalUpdated };
    });
    console.log('trxResult', trxResult);
    return trxResult;
  };

  return await getDbWriter({
    cb,
    table: 'dwDocketEntry',
    action: OPENSEARCH_SYNC_ACTIONS.UPSERT,
  });
}

main().catch(console.error);
