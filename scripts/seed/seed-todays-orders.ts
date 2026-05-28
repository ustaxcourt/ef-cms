// TODO : DELETE THIS FILE

/**
 * Local dev seed script: creates N cases and seeds each with a served order,
 * so that Today's Orders (public app) shows paginated results.
 *
 * Usage:
 *   npx ts-node --transpile-only scripts/seed/seed-todays-orders.ts [count]
 *
 * Prerequisites: local stack running (API on :4000, OpenSearch on :9200).
 *
 * NOTE: This is a scratch file for local development only. Delete before committing.
 */

import axios from 'axios';
import jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import {
  createISODateString,
  getCurrentDateTimeInMillis,
} from '@shared/business/utilities/DateHandler';
import { v4 } from 'uuid';

const mockUsers = require('../../web-api/storage/fixtures/seed/users.json');

const API = 'http://localhost:4000';
const JWT_SECRET = 'secret';
const ORDER_COUNT = parseInt(process.argv[2] ?? '25', 10);
/** ms to wait after firing an async (204) endpoint before polling */
const ASYNC_SETTLE_MS = 3_000;
/** max ms to poll before giving up on a step */
const POLL_TIMEOUT_MS = 30_000;

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

function buildUserMap(
  users: Array<Record<string, string>>,
): Record<string, Record<string, string>> {
  const map: Record<string, Record<string, string>> = {};
  for (const u of users) {
    if (!u.userId || !u.email) continue;
    const entry = pick(u, ['email', 'name', 'userId']) as Record<
      string,
      string
    >;
    entry['custom:role'] = u.role;
    map[u.email.toLowerCase()] = entry;
  }
  return map;
}

function makeToken(userRecord: Record<string, string>): string {
  return jwt.sign(
    { ...userRecord, 'custom:userId': userRecord.userId },
    JWT_SECRET,
  );
}

function authHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

// ---------------------------------------------------------------------------
// Polling helper
// ---------------------------------------------------------------------------

async function poll<T>(fn: () => Promise<T | null>, label: string): Promise<T> {
  const deadline = getCurrentDateTimeInMillis() + POLL_TIMEOUT_MS;
  while (getCurrentDateTimeInMillis() < deadline) {
    const result = await fn();
    if (result !== null) return result;
    await sleep(1_000);
  }
  throw new Error(`Timed out waiting for: ${label}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

async function createCase(petitionerToken: string): Promise<string> {
  const res = await axios.post(
    `${API}/cases`,
    {
      petitionFileId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
      petitionMetadata: {
        caseType: 'CDP (Lien/Levy)',
        contactPrimary: {
          address1: '123 Main St',
          city: 'Somecity',
          countryType: 'domestic',
          email: 'petitioner@example.com',
          name: 'Test Petitioner',
          phone: '555-1234',
          postalCode: '12345',
          serviceIndicator: 'Electronic',
          state: 'WA',
        },
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: 'Petitioner',
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Seattle, Washington',
        procedureType: 'Regular',
        stinFile: {},
        stinFileSize: 1,
      },
      stinFileId: '2efcd272-da92-4e31-bedc-28cdad2e08b0',
    },
    { headers: authHeader(petitionerToken) },
  );
  const { docketNumber } = res.data;
  if (!docketNumber) throw new Error('createCase: no docketNumber in response');
  return docketNumber as string;
}

async function createOrderPdf(
  docketClerkToken: string,
  docketNumber: string,
  documentTitle: string,
): Promise<string> {
  const res = await axios.post(
    `${API}/api/court-issued-order`,
    {
      addedDocketNumbers: [],
      contentHtml: `<p>${documentTitle}</p>`,
      docketNumber,
      documentTitle,
      eventCode: 'O',
    },
    { headers: authHeader(docketClerkToken) },
  );
  const { fileId } = res.data;
  if (!fileId) throw new Error('createOrderPdf: no fileId in response');
  return fileId as string;
}

async function fileOrderDraft(
  docketClerkToken: string,
  docketNumber: string,
  fileId: string,
  documentTitle: string,
): Promise<void> {
  // This is an isAsyncSync endpoint – returns 204 immediately; lambda runs in background.
  await axios.post(
    `${API}/async/case-documents/${docketNumber}/court-issued-order`,
    {
      documentMetadata: {
        docketNumber,
        documentTitle,
        documentType: 'Order',
        draftOrderState: {},
        eventCode: 'O',
      },
      primaryDocumentFileId: fileId,
    },
    { headers: authHeader(docketClerkToken), validateStatus: () => true },
  );
}

async function getCase(
  docketClerkToken: string,
  docketNumber: string,
): Promise<any> {
  const res = await axios.get(`${API}/cases/${docketNumber}`, {
    headers: authHeader(docketClerkToken),
  });
  return res.data;
}

async function waitForDraftEntry(
  docketClerkToken: string,
  docketNumber: string,
  documentTitle: string,
): Promise<string> {
  await sleep(ASYNC_SETTLE_MS);
  return poll(async () => {
    const caseDetail = await getCase(docketClerkToken, docketNumber);
    const draft = (caseDetail.docketEntries ?? []).find(
      (e: any) => e.isDraft && e.documentTitle === documentTitle,
    );
    return draft ? (draft.docketEntryId as string) : null;
  }, `draft order to appear on case ${docketNumber}`);
}

async function fileDocketEntry(
  docketClerkToken: string,
  docketNumber: string,
  docketEntryId: string,
  documentTitle: string,
): Promise<void> {
  await axios.post(
    `${API}/case-documents/${docketNumber}/court-issued-docket-entry`,
    {
      docketNumbers: [],
      documentMeta: {
        docketEntryId,
        docketNumber,
        documentTitle,
        documentType: 'Order',
        eventCode: 'O',
        judge: 'Colvin',
      },
      subjectDocketNumber: docketNumber,
    },
    { headers: authHeader(docketClerkToken) },
  );
}

async function serveOrder(
  docketClerkToken: string,
  docketNumber: string,
  docketEntryId: string,
  documentTitle: string,
): Promise<void> {
  // isAsync endpoint – returns 204 immediately.
  await axios.post(
    `${API}/async/case-documents/${docketNumber}/file-and-serve-court-issued-docket-entry`,
    {
      clientConnectionId: v4(),
      docketEntryId,
      docketNumbers: [],
      form: {
        docketEntryId,
        documentTitle,
        documentType: 'Order',
        eventCode: 'O',
        judge: 'Colvin',
      },
      subjectCaseDocketNumber: docketNumber,
    },
    { headers: authHeader(docketClerkToken), validateStatus: () => true },
  );
  // Give the background lambda time to index the document in OpenSearch.
  await sleep(ASYNC_SETTLE_MS);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const userMap = buildUserMap(mockUsers);

  const petitionerRecord = userMap['petitioner@example.com'];
  const docketClerkRecord = userMap['docketclerk@example.com'];

  if (!petitionerRecord || !docketClerkRecord) {
    throw new Error('Could not find required seed users in users.json');
  }

  const petitionerToken = makeToken(petitionerRecord);
  const docketClerkToken = makeToken(docketClerkRecord);

  console.log(`Seeding ${ORDER_COUNT} orders into Today's Orders…`);

  let succeeded = 0;
  let failed = 0;

  for (let i = 1; i <= ORDER_COUNT; i++) {
    const documentTitle = `Seed Order ${i} – ${createISODateString()}`;
    try {
      process.stdout.write(`  [${i}/${ORDER_COUNT}] Creating case… `);
      const docketNumber = await createCase(petitionerToken);
      process.stdout.write(`${docketNumber} | Creating PDF… `);

      const fileId = await createOrderPdf(
        docketClerkToken,
        docketNumber,
        documentTitle,
      );
      process.stdout.write(`ok | Filing draft… `);

      await fileOrderDraft(
        docketClerkToken,
        docketNumber,
        fileId,
        documentTitle,
      );
      process.stdout.write(`ok | Waiting for draft… `);

      const docketEntryId = await waitForDraftEntry(
        docketClerkToken,
        docketNumber,
        documentTitle,
      );
      process.stdout.write(
        `${docketEntryId.slice(0, 8)}… | Filing docket entry… `,
      );

      await fileDocketEntry(
        docketClerkToken,
        docketNumber,
        docketEntryId,
        documentTitle,
      );
      process.stdout.write(`ok | Serving… `);

      await serveOrder(
        docketClerkToken,
        docketNumber,
        docketEntryId,
        documentTitle,
      );
      console.log(`done ✓`);
      succeeded++;
    } catch (err: any) {
      const message = err?.response?.data
        ? JSON.stringify(err.response.data).slice(0, 200)
        : (err?.message ?? String(err));
      console.log(`FAILED: ${message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${succeeded} succeeded, ${failed} failed.`);
  console.log(`Visit http://localhost:5678/todays-orders to verify.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
