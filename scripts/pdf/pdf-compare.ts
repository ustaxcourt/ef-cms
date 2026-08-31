#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { analyzePdf, comparePdfs } from './pdf-compare.helpers';
import { readFileSync } from 'fs';

const scriptConfig: ScriptConfig = {
  description:
    'pdf-compare - prove whether a repair altered document content, by hashing every decoded content stream in both files',
  parameters: {
    original: {
      description: 'path to the PDF that was repaired',
      position: 0,
      required: true,
      type: 'string',
    },
    repaired: {
      description: 'path to the repaired PDF',
      position: 1,
      required: true,
      type: 'string',
    },
  },
};
const { original, repaired } = parseArgsAndEnvVars(scriptConfig) as {
  original: string;
  repaired: string;
};

const row = (label: string, left: unknown, right: unknown): void => {
  const same = String(left) === String(right);
  console.log(
    `  ${label.padEnd(22)}${String(left).padStart(9)}${String(right).padStart(10)}   ${same ? 'same' : 'DIFFERS'}`,
  );
};

(() => {
  const before = analyzePdf(readFileSync(original));
  const after = analyzePdf(readFileSync(repaired));
  const comparison = comparePdfs(before, after);

  console.log('--- file ---');
  console.log(
    `  ${'  '.padEnd(22)}${'original'.padStart(9)}${'repaired'.padStart(10)}`,
  );
  row('bytes', before.size, after.size);
  row('object streams', before.objectStreamCount, after.objectStreamCount);

  console.log('--- object type census ---');
  const types = [
    ...new Set([
      ...Object.keys(before.typeCounts),
      ...Object.keys(after.typeCounts),
    ]),
  ].sort();
  for (const type of types) {
    row(type, before.typeCounts[type] || 0, after.typeCounts[type] || 0);
  }

  console.log('--- content streams (structural excluded) ---');
  row('streams', before.hashes.length, after.hashes.length);
  console.log(`  byte-identical        ${comparison.byteIdenticalStreams}`);
  console.log(`  only in original      ${comparison.onlyInOriginal}`);
  console.log(`  only in repaired      ${comparison.onlyInRepaired}`);
  if (before.undecodable.length || after.undecodable.length) {
    row('undecodable', before.undecodable.length, after.undecodable.length);
  }

  console.log('--- document features ---');
  row('/Encrypt', before.hasEncryption, after.hasEncryption);
  row('/AcroForm', before.hasAcroForm, after.hasAcroForm);
  row('digital signature', before.hasSignature, after.hasSignature);
  row('/XFA', before.hasXfa, after.hasXfa);

  console.log('');
  console.log('VERDICT');
  console.log(`  ${comparison.verdict}`);
  for (const warning of comparison.warnings) {
    console.log(`  !! ${warning}`);
  }
})();
