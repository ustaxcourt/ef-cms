#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { sleep } from '@shared/tools/helpers';

const scriptConfig: ScriptConfig = {
  description:
    'populate-dw_work_item-docket_entry_id-column - Populates the ' +
    'docket_entry_id column in the dw_work_item table utilizing the ' +
    'restored dw_work_item_prod table',
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await sleep(500); // delete me - just here to keep the async, async

  // for each record in dw_work_item:
  // -  fetch that same item from dw_work_item_prod
  // -  set dw_work_item.docket_entry_id to dw_work_item_prod.docket_entry.docket_entry_id
})();
