#!/usr/bin/env -S npx ts-node --transpile-only

import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import {
  parseArgsAndEnvVars,
  ScriptConfig,
} from 'scripts/helpers/parseArgsAndEnvVars';

const scriptConfig: ScriptConfig = {
  description:
    'setup-chief-judge-name-flag - Sets the name of Chief Judge name in Feature Flag table',
  parameters: {
    chiefJudgeName: {
      default: 'Maurice B. Foley',
      position: 0,
      required: false,
      type: 'string',
    },
  },
};
const { chiefJudgeName } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  chiefJudgeName: string;
};

async function setupChiefJudgeNameFlag() {
  const VALUE = chiefJudgeName;

  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: [
      {
        name: 'chief-judge-name',
        value: { current: VALUE },
      },
    ],
    onConflictColumns: ['name'],
  });
}

void setupChiefJudgeNameFlag();
