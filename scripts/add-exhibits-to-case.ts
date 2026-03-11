#!/usr/bin/env -S npx ts-node --transpile-only

// usage: API_URL=https://app-green.example.com DEFAULT_ACCOUNT_PASS=password ./scripts/add-exhibits-to-case.ts -d 123-24 -e 100
// or:   API_URL=http://localhost:4000 DEFAULT_ACCOUNT_PASS=Testing1234$ ./scripts/add-exhibits-to-case.ts -d 123-24 -e 5

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from './helpers/parseArgsAndEnvVars';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const FormData = require('form-data');

const scriptConfig: ScriptConfig = {
  description: 'Add exhibits to an existing case via API endpoints',
  environment: {
    apiUrl: 'API_URL',
    defaultPassword: 'DEFAULT_ACCOUNT_PASS',
  },
  parameters: {
    docketNumber: {
      required: true,
      short: 'd',
      type: 'string',
    },
    email: {
      default: 'petitioner1@example.com',
      short: 'u',
      type: 'string',
    },
    exhibits: {
      default: '100',
      short: 'e',
      type: 'string',
      transform: 'number',
    },
    pollInterval: {
      default: '2000',
      description:
        'Interval in ms between polling attempts when waiting for async results.',
      type: 'string',
      transform: 'number',
    },
  },
};

const { apiUrl, defaultPassword, pollInterval, docketNumber, email, exhibits, verbose } =
  parseArgsAndEnvVars(scriptConfig) as {
    apiUrl: string;
    defaultPassword: string;
    pollInterval: number;
    docketNumber: string;
    email: string;
    exhibits: number;
    verbose: boolean;
  };

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function loginAndGetToken(): Promise<string> {
  console.log(`  Logging in as ${email}...`);
  const response = await axios.post(`${apiUrl}/auth/login`, {
    email,
    password: defaultPassword,
  });
  const { idToken } = response.data;
  if (!idToken) {
    throw new Error('Login failed: no idToken returned');
  }
  console.log('  Login successful.');
  return idToken;
}

async function getCaseDetails(
  token: string,
): Promise<{ petitionerContactId: string }> {
  const response = await axios.get(`${apiUrl}/cases/${docketNumber}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { excludeDocketEntries: true },
  });
  const petitionerContactId = response.data?.petitioners?.[0]?.contactId;
  if (!petitionerContactId) {
    throw new Error(
      'Could not find petitioner contact ID on case. Ensure the case exists and is served.',
    );
  }
  return { petitionerContactId };
}

async function pollForAsyncResult(
  token: string,
  asyncSyncId: string,
): Promise<void> {
  const maxAttempts = 120; // 120 * 2s = 4 min timeout
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await sleep(pollInterval);
    const response = await axios.get(
      `${apiUrl}/results/fetch/${asyncSyncId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (response.data) {
      const result =
        typeof response.data.response === 'string'
          ? JSON.parse(response.data.response)
          : response.data.response;
      if (result && +result.statusCode !== 200) {
        throw new Error(
          `Exhibit filing failed with status ${result.statusCode}: ${JSON.stringify(result.body)}`,
        );
      }
      return;
    }
    if (verbose) {
      console.log(`    Polling for result... (attempt ${attempt}/${maxAttempts})`);
    }
  }
  throw new Error(
    `Timed out waiting for async result after ${maxAttempts} attempts`,
  );
}

async function getUploadPolicy(
  token: string,
  key: string,
): Promise<{ url: string; fields: Record<string, string> }> {
  const response = await axios.get(
    `${apiUrl}/documents/${key}/upload-policy`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
}

async function uploadPdfToS3(
  policy: { url: string; fields: Record<string, string> },
  key: string,
  pdfBuffer: Buffer,
): Promise<void> {
  const formData = new FormData();
  formData.append('key', key);
  formData.append('X-Amz-Algorithm', policy.fields['X-Amz-Algorithm']);
  formData.append('X-Amz-Credential', policy.fields['X-Amz-Credential']);
  formData.append('X-Amz-Date', policy.fields['X-Amz-Date']);
  formData.append(
    'X-Amz-Security-Token',
    policy.fields['X-Amz-Security-Token'] || '',
  );
  formData.append('Policy', policy.fields.Policy);
  formData.append('X-Amz-Signature', policy.fields['X-Amz-Signature']);
  formData.append('content-type', 'application/pdf');
  formData.append('file', pdfBuffer, {
    filename: 'exhibit.pdf',
    contentType: 'application/pdf',
  });

  await axios.post(policy.url, formData, {
    headers: formData.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
}

async function fileExhibitAndWait(
  token: string,
  key: string,
  petitionerContactId: string,
): Promise<void> {
  const asyncSyncId = uuidv4();
  const documentMetadata = {
    docketNumber,
    primaryDocumentId: key,
    documentTitle: 'Exhibit(s)',
    documentType: 'Exhibit(s)',
    eventCode: 'EXH',
    category: 'Miscellaneous',
    filingDate: new Date().toISOString(),
    filers: [petitionerContactId],
    isFileAttached: true,
    scenario: 'Standard',
  };

  // Send the async request with an asyncSyncId header so the Lambda
  // saves its response for us to retrieve via polling.
  await axios.post(
    `${apiUrl}/async/case-documents/${docketNumber}/external-document`,
    { documentMetadata },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Asyncsyncid: asyncSyncId,
      },
    },
  );

  // Poll GET /results/fetch/:asyncSyncId until the Lambda finishes
  await pollForAsyncResult(token, asyncSyncId);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  console.log('\n--- ADD EXHIBITS TO CASE ---');
  console.log(`  API URL:            ${apiUrl}`);
  console.log(`  Docket Number:      ${docketNumber}`);
  console.log(`  Exhibits to add:    ${exhibits}`);
  console.log(`  Login email:        ${email}`);
  console.log(`  Poll interval:      ${pollInterval}ms`);
  console.log('');

  try {
    // Step 1: Login
    console.log('Step 1: Authenticating...');
    const token = await loginAndGetToken();

    // Step 2: Get case details for petitioner contactId
    console.log('\nStep 2: Fetching case details...');
    const { petitionerContactId } = await getCaseDetails(token);
    console.log(`  Petitioner contact ID: ${petitionerContactId}`);

    // Step 3: Load sample PDF
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
      pdfBuffer = Buffer.from(
        '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Test Document) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000317 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n409\n%%EOF',
      );
    }

    // Step 4: Add exhibits one at a time, waiting for each to complete
    console.log(`\nStep 3: Adding ${exhibits} exhibits...\n`);

    let exhibitsCreated = 0;
    let exhibitsFailed = 0;

    for (let i = 0; i < exhibits; i++) {
      const exhibitNumber = i + 1;
      const key = uuidv4();

      try {
        // Get upload policy
        const policy = await getUploadPolicy(token, key);

        // Upload PDF to S3
        await uploadPdfToS3(policy, key, pdfBuffer);

        // File the exhibit and wait for the async Lambda to finish
        await fileExhibitAndWait(token, key, petitionerContactId);

        exhibitsCreated++;
        console.log(`  [${exhibitNumber}/${exhibits}] Confirmed`);
      } catch (error: unknown) {
        exhibitsFailed++;
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(
          `  [${exhibitNumber}/${exhibits}] FAILED: ${errorMessage}`,
        );
        if (verbose && axios.isAxiosError(error)) {
          console.error('    Response:', error.response?.data);
        }
      }
    }

    console.log('\n--- SUMMARY ---');
    console.log(`  Docket Number:    ${docketNumber}`);
    console.log(`  Exhibits Filed:   ${exhibitsCreated}/${exhibits}`);
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
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error('\nFatal Error:', errorMessage);
    if (verbose && axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
    }
    process.exit(1);
  }
})();
