#!/usr/bin/env -S npx ts-node --transpile-only

// usage: ./scripts/create-large-case-with-exhibits.ts -e 100
// or: ./scripts/create-large-case-with-exhibits.ts -e 5000 --env dev
// or: ./scripts/create-large-case-with-exhibits.ts -e 100 -d 123-24 (add exhibits to existing case)

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from './helpers/parseArgsAndEnvVars';
import { createApplicationContext } from '@web-api/applicationContext';
import { createCaseInteractor } from '@web-api/business/useCases/createCaseInteractor';
import { serveCaseToIrsInteractor } from '@web-api/business/useCases/serveCaseToIrs/serveCaseToIrsInteractor';
import { fileExternalDocumentInteractor } from '@web-api/business/useCases/externalDocument/fileExternalDocumentInteractor';
import { petitionsClerkUser, petitionerUser } from '@shared/test/mockUsers';
import { getUniqueId } from '@shared/sharedAppContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import * as path from 'path';
import * as fs from 'fs';

const scriptConfig: ScriptConfig = {
  description:
    'Create a petition, serve it, and add exhibits to test large cases',
  environment: {
    env: 'ENV',
  },
  parameters: {
    docketNumber: {
      default: '',
      short: 'd',
      type: 'string',
    },
    exhibits: {
      default: '5000',
      short: 'e',
      type: 'string',
      transform: 'number',
    },
    userId: {
      default: '',
      short: 'u',
      type: 'string',
    },
  },
  requireActiveAwsSession: false,
};

const {
  docketNumber: existingDocketNumber,
  env,
  exhibits,
  userId,
  verbose,
} = parseArgsAndEnvVars(scriptConfig) as {
  docketNumber: string;
  env: string;
  exhibits: number;
  userId: string;
  verbose: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises, complexity
(async () => {
  // For local environment, override AWS credentials to use S3RVER
  if (env === 'local') {
    process.env.AWS_ACCESS_KEY_ID = 'S3RVER';
    process.env.AWS_SECRET_ACCESS_KEY = 'S3RVER';
  }

  // Use actual database user IDs
  const petitionerUserId = '7805d1ab-18d0-43ec-bafb-654e83405416';
  const petitionsClerkUserId = '3805d1ab-18d0-43ec-bafb-654e83405416';

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  CREATE LARGE CASE WITH EXHIBITS       ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`  Environment:        ${env}`);
  console.log(`  Exhibits to create: ${exhibits}`);
  if (existingDocketNumber) {
    console.log(`  Existing Case:      ${existingDocketNumber}`);
  }
  console.log(`  Petitioner User:    ${petitionerUserId}`);
  console.log(`  Clerk User:         ${petitionsClerkUserId}`);
  console.log('');

  // Use petitionerUser for creating the petition (petitioners file petitions)
  const applicationContextPetitioner = createApplicationContext({
    ...petitionerUser,
    userId: userId || petitionerUserId,
  });

  // Use petitioner as authorized user for creating the petition
  const petitionerAuthorizedUser = {
    email: petitionerUser.email,
    name: petitionerUser.name,
    role: petitionerUser.role,
    userId: userId || petitionerUserId,
  };

  // Use petitionsClerkUser for serving and adding exhibits
  const applicationContextClerk = createApplicationContext({
    ...petitionsClerkUser,
    userId: petitionsClerkUserId,
  });

  const clerkAuthorizedUser = {
    email: petitionsClerkUser.email,
    name: petitionsClerkUser.name,
    role: petitionsClerkUser.role,
    userId: petitionsClerkUserId,
  };

  // Track success/failure
  let caseCreated = false;
  let caseServed = false;
  let exhibitsCreated = 0;
  let exhibitsFailed = 0;
  let docketNumber = existingDocketNumber || '';

  try {
    const isLocal = env === 'local';

    // Step 1: Create PDF files for petition and STIN
    console.log('Step 1: Preparing PDF files...');
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
    } else {
      // Create a minimal PDF if sample doesn't exist
      pdfBuffer = Buffer.from(
        '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Test Document) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000317 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n409\n%%EOF',
      );
    }

    const petitionFileId = getUniqueId();
    const stinFileId = getUniqueId();

    // Upload petition and STIN PDFs (to s3rver locally, or S3 in deployed)
    await applicationContextPetitioner.getPersistenceGateway().uploadDocument({
      applicationContext: applicationContextPetitioner,
      pdfData: pdfBuffer,
      key: petitionFileId,
    });

    await applicationContextPetitioner.getPersistenceGateway().uploadDocument({
      applicationContext: applicationContextPetitioner,
      pdfData: pdfBuffer,
      key: stinFileId,
    });

    console.log(`✓ PDF files uploaded (${isLocal ? 's3rver' : 'S3'})`);

    if (!existingDocketNumber) {
      // Step 2: Create petition (as petitioner)
      console.log('\nStep 2: Creating petition...');
      const petitionMetadata = {
        caseType: 'Deficiency',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNotices: [
          {
            caseType: 'Deficiency',
            noticeIssuedDate: '2024-01-01T00:00:00.000Z',
            taxYear: '2023',
          },
        ],
        partyType: 'Petitioner',
        contactPrimary: {
          address1: '123 Main St',
          city: 'Anytown',
          countryType: 'domestic',
          name: 'Test Petitioner',
          phone: '123-456-7890',
          postalCode: '12345',
          state: 'CA',
        },
        preferredTrialCity: 'Los Angeles, California',
        procedureType: 'Regular',
        petitionFile: { name: 'petition.pdf' },
        petitionFileSize: pdfBuffer.length,
        stinFile: { name: 'stin.pdf' },
        stinFileSize: pdfBuffer.length,
      };

      const createCaseResult = await createCaseInteractor(
        applicationContextPetitioner,
        {
          petitionFileId,
          petitionMetadata,
          stinFileId,
        },
        petitionerAuthorizedUser,
      );

      ({ docketNumber } = createCaseResult);
      const { docketNumberWithSuffix } = createCaseResult;
      caseCreated = true;
      console.log(`✓ Petition created successfully!`);
      console.log(`  → Case Number: ${docketNumber}`);
      console.log(`  → Docket Number with Suffix: ${docketNumberWithSuffix}`);

      // Step 3: Serve petition to IRS (as petitions clerk)
      console.log('\nStep 3: Serving petition to IRS...');
      console.log(`  → Serving case ${docketNumber} to IRS...`);
      try {
        await serveCaseToIrsInteractor(
          applicationContextClerk,
          {
            clientConnectionId: 'script-connection',
            docketNumber,
          },
          clerkAuthorizedUser,
        );
        caseServed = true;
        console.log(`✓ Case ${docketNumber} successfully served to IRS!`);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(`✗ Failed to serve case: ${errorMessage}`);
        console.log(`  ⚠ Case ${docketNumber} created but NOT served`);
        console.log(
          `  → You can manually serve it by logging in as a petitions clerk`,
        );
      }
    } else {
      console.log(
        `\nSkipping Steps 2 & 3: Using existing case ${existingDocketNumber}`,
      );
      caseCreated = true;
      caseServed = true;
    }

    // Step 4: Add exhibits
    console.log(`\nStep 4: Adding ${exhibits} exhibits...`);
    console.log('This may take several minutes...\n');

    // Get the case to retrieve petitioner contact ID for filers
    const { getCaseByDocketNumber } =
      await import('@web-api/persistence/postgres/cases/getCaseByDocketNumber');
    const caseRecord = await getCaseByDocketNumber({ docketNumber });
    const petitionerContactId = caseRecord.petitioners?.[0]?.contactId;

    if (!petitionerContactId) {
      throw new Error('Could not find petitioner contact ID on case');
    }

    console.log(`  → Using petitioner contact ID: ${petitionerContactId}\n`);

    const batchSize = 50;
    const totalBatches = Math.ceil(exhibits / batchSize);

    for (let batch = 0; batch < totalBatches; batch++) {
      const exhibitsInBatch = Math.min(batchSize, exhibits - batch * batchSize);

      // Prepare all exhibit file IDs and upload PDFs in parallel
      const exhibitFileIds: string[] = [];
      const uploadPromises: Promise<void>[] = [];

      for (let i = 0; i < exhibitsInBatch; i++) {
        const exhibitFileId = getUniqueId();
        exhibitFileIds.push(exhibitFileId);

        // Upload exhibit PDF (to s3rver locally, or S3 in deployed)
        uploadPromises.push(
          applicationContextPetitioner.getPersistenceGateway().uploadDocument({
            applicationContext: applicationContextPetitioner,
            pdfData: pdfBuffer,
            key: exhibitFileId,
          }),
        );
      }

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);

      // File exhibits sequentially to avoid locking conflicts
      for (let i = 0; i < exhibitFileIds.length; i++) {
        const exhibitFileId = exhibitFileIds[i];
        const exhibitNumber = batch * batchSize + i + 1;

        console.log(
          `  → Filing exhibit ${exhibitNumber} (ID: ${exhibitFileId})...`,
        );

        // Create exhibit metadata
        const exhibitMetadata = {
          docketNumber,
          primaryDocumentId: exhibitFileId,
          documentTitle: 'Exhibit(s)',
          documentType: 'Exhibit(s)',
          eventCode: 'EXH',
          category: 'Miscellaneous',
          filingDate: createISODateString(),
          filers: [petitionerContactId], // Include petitioner as filer
          isFileAttached: true,
          scenario: 'Standard',
        };

        // File the exhibit (as petitioner - external documents are filed by external parties)
        try {
          await fileExternalDocumentInteractor(
            applicationContextPetitioner,
            { documentMetadata: exhibitMetadata },
            petitionerAuthorizedUser,
          );
          exhibitsCreated++;
          console.log(`    ✓ Exhibit ${exhibitNumber} filed successfully`);
        } catch (error: unknown) {
          exhibitsFailed++;
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.error(
            `    ✗ Failed to file exhibit ${exhibitNumber}: ${errorMessage}`,
          );
        }
      }

      const exhibitsCompleted = Math.min((batch + 1) * batchSize, exhibits);
      const percentComplete = ((exhibitsCompleted / exhibits) * 100).toFixed(1);
      console.log(`\n  ━━━ Batch ${batch + 1}/${totalBatches} Complete ━━━`);
      console.log(
        `  Progress: ${exhibitsCompleted}/${exhibits} exhibits filed (${percentComplete}%)\n`,
      );
    }

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║           CASE SUMMARY                 ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`  Case Number:           ${docketNumber}`);
    console.log(`  Environment:           ${env}`);
    console.log('');
    console.log(`  Case Created:          ${caseCreated ? '✓ Yes' : '✗ No'}`);
    console.log(`  Case Served:           ${caseServed ? '✓ Yes' : '✗ No'}`);
    console.log(`  Exhibits Filed:        ${exhibitsCreated}/${exhibits}`);
    if (exhibitsFailed > 0) {
      console.log(`  Exhibits Failed:       ${exhibitsFailed}`);
    }
    console.log('');

    if (caseCreated && !caseServed) {
      console.log('  ⚠ ACTION REQUIRED:');
      console.log(`  → Case ${docketNumber} needs to be manually served`);
      console.log('  → Log in as a petitions clerk to serve the petition');
      console.log('');
    }

    const allSuccess =
      caseCreated && caseServed && exhibitsCreated === exhibits;
    if (allSuccess) {
      console.log('✓ Script completed successfully!\n');
    } else {
      console.log('⚠ Script completed with warnings/errors\n');
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('\n✗ Fatal Error:', errorMessage);
    if (verbose) {
      console.error(error);
    }

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║        PARTIAL RESULTS                 ║');
    console.log('╚════════════════════════════════════════╝');
    if (caseCreated) {
      console.log(`  Case Number:    ${docketNumber}`);
      console.log(`  Case Created:   ✓ Yes`);
      console.log(`  Case Served:    ${caseServed ? '✓ Yes' : '✗ No'}`);
    } else {
      console.log('  No case was created');
    }
    console.log('');

    process.exit(1);
  }
})();
