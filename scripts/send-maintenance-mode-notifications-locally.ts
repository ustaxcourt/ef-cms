#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from './helpers/parseArgsAndEnvVars';
import { sendMaintenanceNotificationsLambda } from '@web-api/lambdas/cases/sendMaintenanceNotificationsLambda';

const scriptConfig: ScriptConfig = {
  description: 'set-maintenance-mode-locally - Toggles Maintenance Mode',
  parameters: {
    toggle: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
};
const { toggle } = parseArgsAndEnvVars(scriptConfig) as { toggle: string };

export const setMaintenanceModeLocally = async () => {
  await sendMaintenanceNotificationsLambda({
    maintenanceMode: toggle === 'true',
  });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await setMaintenanceModeLocally();
})();
