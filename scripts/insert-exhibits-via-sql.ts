#!/usr/bin/env -S npx ts-node --transpile-only

// usage: ENV=local ./scripts/insert-exhibits-via-sql.ts -d 16017-21 -e 4000 -f 4c7a6796-... -r ab4aade7-...

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from './helpers/parseArgsAndEnvVars';
import { createApplicationContext } from '@web-api/applicationContext';
import { petitionerUser } from '@shared/test/mockUsers';
import { getDbReader } from '@web-api/database';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { getUniqueId } from '@shared/sharedAppContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';

const scriptConfig: ScriptConfig = {
  description:
    'Upload PDFs to S3 and insert docket entries directly into postgres',
  environment: {
    env: 'ENV',
  },
  parameters: {
    docketNumber: {
      required: true,
      short: 'd',
      type: 'string',
    },
    exhibits: {
      default: '100',
      short: 'e',
      type: 'string',
      transform: 'number',
    },
    filerId: {
      required: true,
      short: 'f',
      type: 'string',
    },
    referenceEntryId: {
      required: true,
      short: 'r',
      type: 'string',
    },
  },
  requireActiveAwsSession: false,
};

const { env, verbose, docketNumber, exhibits, filerId, referenceEntryId } =
  parseArgsAndEnvVars(scriptConfig) as {
    env: string;
    verbose: boolean;
    docketNumber: string;
    exhibits: number;
    filerId: string;
    referenceEntryId: string;
  };

const confirmAction = async (message: string): Promise<boolean> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => {
    rl.question(`${message} (yes/no): `, answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises, complexity
(async () => {
  if (env === 'local') {
    process.env.AWS_ACCESS_KEY_ID = 'S3RVER';
    process.env.AWS_SECRET_ACCESS_KEY = 'S3RVER';
  }

  console.log('\n--- INSERT EXHIBITS VIA SQL ---');
  console.log(`  Environment:        ${env}`);
  console.log(`  Docket Number:      ${docketNumber}`);
  console.log(`  Exhibits to add:    ${exhibits}`);
  console.log(`  Filer ID:           ${filerId}`);
  console.log(`  Reference Entry ID: ${referenceEntryId}`);
  console.log('');

  if (env !== 'local') {
    const confirmed = await confirmAction(
      `You are about to insert ${exhibits} exhibits into ${env} for case ${docketNumber}. Are you sure?`,
    );
    if (!confirmed) {
      console.log('Aborted.');
      process.exit(0);
    }
  }

  try {
    // Step 1: Get reference data from an existing docket entry
    console.log('Step 1: Fetching reference docket entry and max index...');
    const [referenceEntry, maxIndexResult] = await Promise.all([
      getDbReader(reader =>
        reader
          .selectFrom('dwDocketEntry')
          .select([
            'filedBy',
            'servedParties',
            'servedPartiesCode',
            'userId',
            'stampData',
            'filers',
          ])
          .where('docketEntryId', '=', referenceEntryId)
          .executeTakeFirst(),
      ),
      getDbReader(reader =>
        reader
          .selectFrom('dwDocketEntry')
          .select(eb => eb.fn.max('index').as('maxIndex'))
          .where('docketNumber', '=', docketNumber)
          .executeTakeFirst(),
      ),
    ]);

    if (!referenceEntry) {
      throw new Error(`Reference docket entry ${referenceEntryId} not found.`);
    }

    let currentIndex = (maxIndexResult?.maxIndex as number) || 0;
    console.log(`  Current max index: ${currentIndex}`);
    console.log(`  Reference filedBy: ${referenceEntry.filedBy}`);
    console.log(`  Reference userId:  ${referenceEntry.userId}`);

    // Step 2: Load sample PDF
    const samplePdfPath = path.join(
      __dirname,
      '..',
      'shared',
      'test-assets',
      'sample.pdf',
    );
    let pdfBuffer: Buffer;
    if (fs.existsSync(samplePdfPath)) {
      pdfBuffer = fs.readFileSync(samplePdfPath);
      console.log(`\nStep 2: Using sample PDF from ${samplePdfPath}`);
    } else {
      pdfBuffer = Buffer.from(
        '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Test Document) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000317 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n409\n%%EOF',
      );
      console.log('\nStep 2: Using generated minimal PDF');
    }

    // Step 3: Create application context for S3 uploads
    const applicationContext = createApplicationContext({
      ...petitionerUser,
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    });

    // Step 4: Upload and insert exhibits one at a time
    console.log(`\nStep 3: Adding ${exhibits} exhibits...\n`);

    let exhibitsCreated = 0;
    let exhibitsFailed = 0;

    for (let i = 0; i < exhibits; i++) {
      const exhibitNumber = i + 1;
      const docketEntryId = getUniqueId();

      try {
        // Upload PDF to S3
        await applicationContext.getPersistenceGateway().uploadDocument({
          applicationContext,
          pdfData: pdfBuffer,
          key: docketEntryId,
        });

        // Insert docket entry
        currentIndex++;
        const now = createISODateString();
        await pgInsertInto({
          table: 'dwDocketEntry',
          values: {
            createdAt: now,
            docketEntryId,
            docketNumber,
            documentStorageId: docketEntryId,
            filingDate: now,
            eventCode: 'EXH',
            pending: false,
            servedAt: now,
            isLegacyServed: false,
            receivedAt: now,
            documentTitle: 'Exhibit(s)',
            documentType: 'Exhibit(s)',
            isStricken: false,
            isSealed: false,
            numberOfPages: 1,
            addToCoversheet: false,
            filedBy: referenceEntry.filedBy,
            filedByRole: 'petitioner',
            filers:
              typeof referenceEntry.filers === 'string'
                ? referenceEntry.filers
                : JSON.stringify(referenceEntry.filers || [filerId]),
            index: currentIndex,
            isDraft: false,
            isFileAttached: true,
            isOnDocketRecord: true,
            processingStatus: 'pending',
            relationship: 'primaryDocument',
            scenario: 'Standard',
            servedParties:
              typeof referenceEntry.servedParties === 'string'
                ? referenceEntry.servedParties
                : JSON.stringify(referenceEntry.servedParties || []),
            servedPartiesCode: referenceEntry.servedPartiesCode || 'B',
            stampData:
              typeof referenceEntry.stampData === 'string'
                ? referenceEntry.stampData
                : JSON.stringify(referenceEntry.stampData || {}),
            userId: referenceEntry.userId,
          } as any,
        });

        exhibitsCreated++;
        console.log(
          `  [${exhibitNumber}/${exhibits}] Confirmed (index: ${currentIndex})`,
        );
      } catch (error: unknown) {
        exhibitsFailed++;
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(
          `  [${exhibitNumber}/${exhibits}] FAILED: ${errorMessage}`,
        );
        if (verbose) {
          console.error(error);
        }
      }
    }

    console.log('\n--- SUMMARY ---');
    console.log(`  Docket Number:    ${docketNumber}`);
    console.log(`  Exhibits Created: ${exhibitsCreated}/${exhibits}`);
    if (exhibitsFailed > 0) {
      console.log(`  Exhibits Failed:  ${exhibitsFailed}`);
    }
    console.log('');

    if (exhibitsCreated === exhibits) {
      console.log('Script completed successfully!\n');
    } else {
      console.log('Script completed with errors.\n');
      process.exit(1);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('\nFatal Error:', errorMessage);
    if (verbose) {
      console.error(error);
    }
    process.exit(1);
  }
})();
