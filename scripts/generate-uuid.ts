#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from './helpers/parseArgsAndEnvVars';
import { v4 as uuid } from 'uuid';

const scriptConfig: ScriptConfig = {
  description: 'generate-uuid - Generates the specified number of UUIDs',
  parameters: {
    uuids: {
      position: 0,
      transform: 'number',
      type: 'string',
    },
  },
};
const { uuids } = parseArgsAndEnvVars(scriptConfig) as { uuids: number };

(() => {
  const count = uuids || 1;
  for (let i = 0; i < count; i++) {
    console.log(uuid());
  }
})();
