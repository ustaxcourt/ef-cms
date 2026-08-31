#!/usr/bin/env -S npx ts-node --transpile-only

import { PDFDocument } from 'pdf-lib';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  type TriageRow,
  formatTriageTable,
  settleWithFullRead,
  summarizeTriage,
} from './pdf-triage.helpers';
import {
  type DuplicateReport,
  findDuplicateObjectNumbers,
} from './pdf-doctor.helpers';
import { inspectCrossReferenceTable } from './crossReference.helpers';
import { join } from 'path';
import { readFileSync, readdirSync, statSync } from 'fs';

const scriptConfig: ScriptConfig = {
  description:
    'pdf-triage - reads every PDF in a folder and reports which ones carry a duplicated object number. Reads local files only: no AWS session, no network, and nothing is written.',
  parameters: {
    folder: {
      description: 'path to a folder of PDFs to examine',
      position: 0,
      required: true,
      type: 'string',
    },
    verbose: {
      description: 'print the reason for every document, not just the table',
      type: 'boolean',
    },
  },
};

const { folder, verbose } = parseArgsAndEnvVars(scriptConfig) as {
  folder: string;
  verbose?: boolean;
};

/**
 * The same settling `pdf-audit --deep` performs, without the download. A local
 * file can be read in full, so every document gets the definitive verdict from
 * enumerating its objects rather than the screen's provisional one.
 */
const triage = async (path: string, file: string): Promise<TriageRow> => {
  const pdfBytes = new Uint8Array(readFileSync(path));
  const integrity = inspectCrossReferenceTable(pdfBytes);

  let report: DuplicateReport | null = null;
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
      updateMetadata: false,
    });
    report = findDuplicateObjectNumbers(pdfDoc);
  } catch {
    // A document too damaged for pdf-lib to parse is a finding, not a gap;
    // settleWithFullRead keeps the cross-reference verdict in that case.
  }

  return { file, ...settleWithFullRead(integrity, report) };
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  if (!statSync(folder, { throwIfNoEntry: false })?.isDirectory()) {
    console.error(`"${folder}" is not a folder`);
    process.exit(1);
  }

  const files = readdirSync(folder)
    .filter(file => file.toLowerCase().endsWith('.pdf'))
    .sort();

  if (!files.length) {
    console.log(`no PDFs in ${folder}`);
    return;
  }

  const rows: TriageRow[] = [];
  for (const file of files) {
    rows.push(await triage(join(folder, file), file));
  }

  console.log('');
  formatTriageTable(rows).forEach(line => console.log(`  ${line}`));

  if (verbose) {
    console.log('');
    console.log('--- reasons ---');
    for (const row of rows) {
      console.log(`  ${row.file}`);
      console.log(`    ${row.reason}`);
    }
  }

  console.log('');
  console.log('--- summary ---');
  for (const { count, status } of summarizeTriage(rows)) {
    console.log(`  ${status.padEnd(15)} ${String(count).padStart(5)}`);
  }
  console.log('');
  console.log(`  ${rows.length} document(s) read from ${folder}`);
})();
