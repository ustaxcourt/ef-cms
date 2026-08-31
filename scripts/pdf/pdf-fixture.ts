#!/usr/bin/env -S npx ts-node --transpile-only

import { PDFDocument, StandardFonts } from 'pdf-lib';
import { PDF_SAVE_OPTIONS } from '@shared/business/utilities/pdfs/pdfSaveOptions';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { appendSupersededCatalogRevision } from './pdf-fixture.helpers';
import { inspectCrossReferenceTable } from './crossReference.helpers';
import { writeFileSync } from 'fs';

const scriptConfig: ScriptConfig = {
  description:
    'pdf-fixture - writes a valid PDF that carries the precondition for the cross-reference defect: an incremental revision superseding the catalog at a raised generation. Opens cleanly in any reader; breaks when a pipeline re-saves it through pdf-lib.',
  parameters: {
    output: {
      description: 'path to write the fixture to',
      position: 0,
      required: true,
      type: 'string',
    },
    pages: {
      default: '2',
      description: 'how many pages the document should have',
      type: 'string',
    },
  },
};

const { output, pages } = parseArgsAndEnvVars(scriptConfig) as {
  output: string;
  pages: string;
};

const buildSource = async (): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (let index = 0; index < Math.max(1, Number(pages)); index += 1) {
    const page = pdfDoc.addPage([612, 792]);
    page.drawText('DAWSON cross-reference test fixture', {
      font,
      size: 18,
      x: 72,
      y: 700,
    });
    page.drawText(`Page ${index + 1}`, { font, size: 12, x: 72, y: 660 });
    page.drawText('This document is structurally valid.', {
      font,
      size: 12,
      x: 72,
      y: 630,
    });
  }

  // A classic table keeps the appended revision easy to reason about, and the
  // superseded copy has to remain as plain-text object headers for pdf-lib's
  // scanning parser to find it.
  return pdfDoc.save(PDF_SAVE_OPTIONS);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const source = await buildSource();
  const { bytes, revision } = appendSupersededCatalogRevision(source);
  writeFileSync(output, bytes);

  console.log('--- fixture ---');
  console.log(`  written                 ${output}`);
  console.log(`  ${bytes.length} bytes, ${Math.max(1, Number(pages))} page(s)`);
  console.log(
    `  object #${revision.objectNumber} (/Catalog) now exists at generations 0 and ${revision.supersedingGeneration}`,
  );

  // The fixture itself must not be reported as damaged: it is a conforming
  // incremental file, and the checker declines to judge those.
  const before = inspectCrossReferenceTable(bytes);
  console.log('');
  console.log('--- the fixture as written ---');
  console.log(`  ${before.status}: ${before.reason}`);

  // What a pipeline does to it. This is the whole point of the fixture.
  const reSaved = await (
    await PDFDocument.load(bytes, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
      updateMetadata: false,
    })
  ).save(PDF_SAVE_OPTIONS);
  const after = inspectCrossReferenceTable(reSaved);

  console.log('');
  console.log('--- after one pdf-lib load and save ---');
  console.log(`  ${after.status}: ${after.reason}`);

  console.log('');
  if (after.status === 'DUPLICATED') {
    console.log('  The fixture reproduces the defect. Confirm independently:');
    console.log(`    qpdf --check ${output}       # expected: no errors`);
    console.log(
      '  then upload it through the application and run pdf-doctor or qpdf',
    );
    console.log('  against what comes back out of S3.');
  } else {
    console.log(
      `  !! a pdf-lib round trip did NOT damage this document (${after.status}).`,
    );
    console.log(
      '     The fixture is not reproducing the defect - do not rely on it.',
    );
    process.exit(2);
  }
})();
