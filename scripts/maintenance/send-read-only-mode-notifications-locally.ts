#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { sendReadOnlyNotificationsLambda } from '@web-api/lambdas/cases/sendReadOnlyNotificationsLambda';
import axios from 'axios';

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
  const readOnlyMode = toggle === 'true';

  try {
    await axios.put(`http://localhost:4000/read-only-mode`, {
      readOnlyMode,
    });
  } catch (err) {
    console.error(
      'Warning: Could not hit local API to set READ_ONLY_MODE environment variable. Is the backend running?',
    );
  }

  await sendReadOnlyNotificationsLambda({
    readOnlyMode,
  });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await setReadOnlyModeLocally();
})();
