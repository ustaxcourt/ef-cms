#!/usr/bin/env -S npx ts-node --transpile-only

import { getDbWriter } from "@web-api/database";
import { Database } from "@web-api/database-schema";
import { OPENSEARCH_SYNC_ACTIONS } from "@web-api/lambdas/openSearch/openSearchSyncHandler";
import { Kysely } from "kysely";
import { parseArgsAndEnvVars, ScriptConfig } from "scripts/helpers/parseArgsAndEnvVars";

const scriptConfig: ScriptConfig = {
  description:
    'update-document-type: This updates all filings document Title from Report to Event Report',
  environment: {
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

async function main() {   

    const cb = async (db : Kysely<Database>): Promise<any> => {

        const result = await db
            .updateTable("dwDocketEntry")
            .set({ documentType: "Expert Report" })
            .where("documentType", "=", "Report")
            .execute();

        return result;
    }

    return await getDbWriter({cb, table: "dwDocketEntry", action: OPENSEARCH_SYNC_ACTIONS.UPSERT})
}

main().catch(console.error)