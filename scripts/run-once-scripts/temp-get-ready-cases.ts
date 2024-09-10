import { createApplicationContext } from '@web-api/applicationContext';
import { environment } from '@web-api/environment';
import {
  getDestinationTableInfo,
  requireEnvVars,
} from '../../shared/admin-tools/util';
import fs from 'fs';

requireEnvVars(['ENV']);
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext();

  const result = await applicationContext
    .getPersistenceGateway()
    .getCasesReadyForCalendaring({ applicationContext });

  fs.writeFileSync('./ourData.json', JSON.stringify(result, null, 2));
})();
