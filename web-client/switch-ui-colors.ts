import { requireEnvVars } from '../shared/admin-tools/util';
import { switchUiColors } from './switch-ui-colors.helpers';

requireEnvVars([
  'CURRENT_COLOR',
  'DEPLOYING_COLOR',
  'EFCMS_DOMAIN',
  'ZONE_NAME',
]);

const { CURRENT_COLOR, DEPLOYING_COLOR, EFCMS_DOMAIN, ZONE_NAME } = process.env;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await switchUiColors({
    currentColor: CURRENT_COLOR!,
    deployingColor: DEPLOYING_COLOR!,
    efcmsDomain: EFCMS_DOMAIN!,
    publicUi: false,
    zoneName: ZONE_NAME!,
  });
})();
