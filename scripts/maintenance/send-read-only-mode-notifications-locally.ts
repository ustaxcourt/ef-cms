#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { sendReadOnlyNotificationsLambda } from '@web-api/lambdas/cases/sendReadOnlyNotificationsLambda';

const scriptConfig: ScriptConfig = {
  description: 'set-read-only-mode-locally - Toggles read-only mode locally',
  parameters: {
    toggle: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
};
const { toggle } = parseArgsAndEnvVars(scriptConfig) as { toggle: string };

export const setReadOnlyModeLocally = async () => {
  await sendReadOnlyNotificationsLambda({
    readOnlyMode: toggle === 'true',
  });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await setReadOnlyModeLocally();
})();
