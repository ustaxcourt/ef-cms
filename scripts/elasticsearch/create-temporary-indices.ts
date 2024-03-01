import { createNewIndicesFromLocalMappings } from './create-temporary-indices-helpers';
import { requireEnvVars } from '../../shared/admin-tools/util';

requireEnvVars(['ENV', 'OVERRIDE_ES_NUMBER_OF_REPLICAS']);

const environmentName: string = process.env.ENV!;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await createNewIndicesFromLocalMappings({ environmentName });
})();
