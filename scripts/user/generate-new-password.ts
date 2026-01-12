#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { makeNewPassword } from './make-new-password';

const scriptConfig: ScriptConfig = {
  description: 'generate-new-password - Generates a safe password',
  parameters: {
    characters: {
      multiple: true,
      short: 'c',
      type: 'string',
    },
    length: {
      short: 'l',
      transform: 'number',
      type: 'string',
    },
  },
  requireActiveAwsSession: false,
};
const { characters, length } = parseArgsAndEnvVars(scriptConfig) as {
  characters: string[];
  length: number;
};

(() => {
  console.log(makeNewPassword(characters, length));
})();
