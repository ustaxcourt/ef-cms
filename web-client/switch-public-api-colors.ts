import { requireEnvVars } from '../shared/admin-tools/util';
import { switchApiColors } from './switch-api-colors.helpers';

requireEnvVars(['DEPLOYING_COLOR', 'EFCMS_DOMAIN', 'ENV']);

const { DEPLOYING_COLOR, EFCMS_DOMAIN, ENV } = process.env;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await switchApiColors({
    deployingColor: DEPLOYING_COLOR!,
    efcmsDomain: EFCMS_DOMAIN!,
    environmentName: ENV!,
    publicApi: true,
  });
})();
