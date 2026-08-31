#!/usr/bin/env -S npx ts-node --transpile-only

import { PDFDocument } from 'pdf-lib';
import { PDF_SAVE_OPTIONS } from '@shared/business/utilities/pdfs/pdfSaveOptions';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { inspectCrossReferenceTable } from './crossReference.helpers';
import {
  type DuplicateReport,
  findDuplicateObjectNumbers,
  repairDuplicateObjectNumbers,
} from './pdf-doctor.helpers';
import { readFileSync, writeFileSync } from 'fs';

const scriptConfig: ScriptConfig = {
  description:
    'pdf-doctor - report, and optionally repair, a PDF whose cross-reference section carries the residue of a duplicated object number',
  parameters: {
    input: {
      description: 'path to the PDF to examine',
      position: 1,
      required: true,
      type: 'string',
    },
    mode: {
      description: '"check" to report only, "fix" to write a repaired copy',
      position: 0,
      required: true,
      type: 'string',
    },
    output: {
      description: 'path to write the repaired PDF to; required by "fix"',
      position: 2,
      type: 'string',
    },
  },
};
const { input, mode, output } = parseArgsAndEnvVars(scriptConfig) as {
  input: string;
  mode: string;
  output?: string;
};

const report = (label: string, pdfBytes: Uint8Array): void => {
  const integrity = inspectCrossReferenceTable(pdfBytes);
  console.log(`  ${label}`);
  console.log(`    /Size            ${integrity.size}`);
  console.log(`    entries          ${integrity.entryCount}`);
  console.log(`    ${integrity.status}: ${integrity.reason}`);
};

/**
 * Loads the document so its objects can be examined. A file damaged badly
 * enough to defeat pdf-lib is itself a finding, so the caller gets null rather
 * than an exit.
 */
const load = async (pdfBytes: Uint8Array): Promise<PDFDocument | null> => {
  try {
    return await PDFDocument.load(pdfBytes, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
      updateMetadata: false,
    });
  } catch (error) {
    console.error('');
    console.error(
      `  pdf-lib could not load this file: ${(error as Error).message.split('\n')[0]}`,
    );

    return null;
  }
};

const reportDuplicates = ({
  duplicates,
  objectsBefore,
  unresolved,
}: DuplicateReport): void => {
  console.log(`  objects in context      ${objectsBefore}`);
  if (!duplicates.length) {
    console.log('  no duplicates found - any damage here has another cause');
  }
  for (const duplicate of duplicates) {
    const generations = duplicate.generations
      .map(generation =>
        duplicate.liveGenerations.includes(generation)
          ? `${generation}*`
          : `${generation}`,
      )
      .join(', ');
    const declaredType = duplicate.objectType
      ? `/${duplicate.objectType}`
      : 'untyped';
    console.log(
      `  object #${duplicate.objectNumber} (${declaredType}): generations ${generations}   kept gen ${duplicate.keptGeneration}`,
    );
  }
  if (duplicates.length) {
    console.log('  (* = reachable from /Root, i.e. the live copy)');
  }
  if (unresolved) {
    console.log(
      `  !! ${unresolved} object number(s) had no single live generation; the highest`,
    );
    console.log(
      '     was kept as a fallback - verify the result with pdf-compare before trusting it.',
    );
  }
};

const check = async (pdfBytes: Uint8Array): Promise<void> => {
  console.log('--- cross-reference table ---');
  report('input', pdfBytes);

  const pdfDoc = await load(pdfBytes);
  if (!pdfDoc) {
    console.error('  the duplicate survey needs a loadable document.');
    process.exit(2);
  }

  console.log('');
  console.log('--- duplicate object numbers ---');
  reportDuplicates(findDuplicateObjectNumbers(pdfDoc));
};

const fix = async (pdfBytes: Uint8Array, outputPath: string): Promise<void> => {
  console.log('--- before ---');
  report('input', pdfBytes);

  const pdfDoc = await load(pdfBytes);
  if (!pdfDoc) {
    console.error('  an in-place repair does not apply; a rebuild is needed.');
    process.exit(2);
  }

  const result = repairDuplicateObjectNumbers(pdfDoc);

  console.log('');
  console.log('--- repair ---');
  reportDuplicates(result);
  console.log(`  duplicate refs removed  ${result.referencesRemoved}`);

  const repaired = await pdfDoc.save(PDF_SAVE_OPTIONS);
  writeFileSync(outputPath, repaired);
  console.log(`  written                 ${repaired.length} bytes`);

  console.log('');
  console.log('--- after ---');
  report('output', repaired);
  console.log('');
  console.log(
    'Confirm no content was altered:  scripts/pdf/pdf-compare.ts <input> <output>',
  );
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  if (mode !== 'check' && mode !== 'fix') {
    console.error(`unknown mode "${mode}"; expected "check" or "fix"`);
    process.exit(1);
  }
  if (mode === 'fix' && !output) {
    console.error('"fix" requires an output path');
    process.exit(1);
  }

  const pdfBytes = new Uint8Array(readFileSync(input));

  if (mode === 'check') {
    await check(pdfBytes);
  } else {
    await fix(pdfBytes, output!);
  }
})();
