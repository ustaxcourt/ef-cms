#!/usr/bin/env -S npx ts-node --transpile-only

/**
 * Cleanup Cypress test accounts
 *
 * What it does:
 * - Deletes Cypress smoketest users from both Postgres and Cognito.
 * - Postgres: removes records from `dwUser` and `dwUserOnCase` for matching users.
 * - Cognito: deletes users from the primary pool and IRS pool (if `USER_POOL_IRS_ID` is set).
 * - Matching is based on email prefix. In Postgres it checks `email` and `pendingEmail` columns.
 *
 * Why we use it:
 * - Smoketests running on AWS create disposable users. This script cleans up those users to
 *   keep Cognito and Postgres tidy and avoid cluttering subsequent test runs.
 *
 * How to run:
 * - Ensure you have AWS credentials for the target environment.
 * - Required environment variables:
 *   - ENV: environment name (script will abort if not set)
 *   - USER_POOL_IRS_ID: optional; if set, IRS user pool will also be cleaned
 * - Command:
 *   npx ts-node --transpile-only ./scripts/user/cleanup-cypress-test-accounts.ts
 *
 * Behavior notes:
 * - The email prefix is hardcoded as `cypress_test_account`.
 * - Pass 1 (DB-first): find matching users in Postgres (email or pendingEmail ilike prefix%)
 *   then delete in Cognito (all configured pools) and remove from Postgres.
 * - Pass 2 (Cognito-first): find remaining matching users in each Cognito pool and delete
 *   them from Cognito and Postgres.
 * - Cognito deletes are limited with p-limit (concurrency 30) and include retry/backoff on
 *   throttling; missing users are ignored.
 *
 * Caution:
 * - This script performs destructive deletes. Verify ENV and target pools before running.
 */

import {
  CognitoIdentityProvider,
  ListUsersCommandOutput,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import pLimit from 'p-limit';
import { Kysely } from 'kysely';
import type { Database } from '@web-api/persistence/postgres/database-schema';
import { getDb } from '@web-api/persistence/postgres/databaseConnection';
import { getUserPoolId, requireEnvVars } from '../../shared/admin-tools/util';

// ============================================================================
// UTILITIES
// ============================================================================

const AWS_REGION = 'us-east-1';
const DEFAULT_EMAIL_PREFIX = 'cypress_test_account';
const COGNITO_CONCURRENCY = 30; // max in-flight Cognito deletes
const COGNITO_MAX_RETRIES = 5;
const COGNITO_BACKOFF_BASE_MS = 100; // base for exponential backoff
const COGNITO_JITTER_MS = 100; // add jitter to spread retries

function getIrsUserPoolId(): string | undefined {
  const pool = process.env.USER_POOL_IRS_ID;
  return pool && pool.length > 0 ? pool : undefined;
}

// Concurrency limiter for Cognito deletes
const cognitoDeleteLimit = pLimit(COGNITO_CONCURRENCY);

function sleep(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}

// ============================================================================
// COGNITO
// ============================================================================

function extractUserInfo(
  user: UserType,
): { email: string; userId: string } | null {
  const email = user.Attributes?.find(a => a.Name === 'email')?.Value;
  const userId = user.Attributes?.find(a => a.Name === 'custom:userId')?.Value;
  if (!email || !userId) return null;
  return { email, userId };
}

async function listUsersByEmailPrefix({
  cognito,
  userPoolId,
  emailPrefix,
}: {
  cognito: CognitoIdentityProvider;
  userPoolId: string;
  emailPrefix: string;
}): Promise<{ email: string; userId: string }[]> {
  const Filter = `email ^= "${emailPrefix}"`;
  let PaginationToken: string | undefined = undefined;
  const results: { email: string; userId: string }[] = [];

  do {
    const { Users = [], PaginationToken: nextToken }: ListUsersCommandOutput =
      await cognito.listUsers({
        Filter,
        PaginationToken,
        UserPoolId: userPoolId,
      });
    for (const user of Users) {
      const info = extractUserInfo(user);
      if (info) results.push(info);
    }
    PaginationToken = nextToken;
  } while (PaginationToken);

  return results;
}

async function deleteCognitoUser({
  cognito,
  userPoolId,
  email,
}: {
  cognito: CognitoIdentityProvider;
  userPoolId: string;
  email: string;
}): Promise<void> {
  await cognitoDeleteLimit(async () => {
    try {
      await cognito.adminDeleteUser({
        UserPoolId: userPoolId,
        Username: email.toLowerCase(),
      });
    } catch (err: unknown) {
      const name = (err as { name?: string; __type?: string })?.name || (err as { name?: string; __type?: string })?.__type;
      // Swallow user not existing
      if (name === 'UserNotFoundException') {
        return;
      }
      // Handle throttling with retries + jitter
      if (
        name === 'TooManyRequestsException' ||
        name === 'LimitExceededException' ||
        name === 'ThrottlingException'
      ) {
        const maxRetries = COGNITO_MAX_RETRIES;
        let attempt = 0;
        while (attempt < maxRetries) {
          attempt++;
          const base = Math.pow(2, attempt) * COGNITO_BACKOFF_BASE_MS; // 200ms, 400ms, 800ms, ...
          const jitter = Math.floor(Math.random() * COGNITO_JITTER_MS);
          await sleep(base + jitter);
          try {
            await cognito.adminDeleteUser({
              UserPoolId: userPoolId,
              Username: email.toLowerCase(),
            });
            return;
          } catch (e2: unknown) {
            const n2 = (e2 as { name?: string; __type?: string })?.name || (e2 as { name?: string; __type?: string })?.__type;
            if (n2 === 'UserNotFoundException') return;
            if (
              !(
                n2 === 'TooManyRequestsException' ||
                n2 === 'LimitExceededException' ||
                n2 === 'ThrottlingException'
              )
            ) {
              throw e2;
            }
            // else loop and retry
          }
        }
      }
      // Re-throw others to be handled by caller
      throw err;
    }
  });
}

// ============================================================================
// POSTGRES
// ============================================================================

async function deleteAllUserRecords(
  db: Kysely<Database>,
  userId: string,
): Promise<void> {
  const deleteUserRecord = db
    .deleteFrom('dwUser')
    .where('userId', '=', userId)
    .execute();
  const deleteUserOnCaseRecords = db
    .deleteFrom('dwUserOnCase')
    .where('userId', '=', userId)
    .execute();
  await Promise.allSettled([deleteUserRecord, deleteUserOnCaseRecords]);
}

async function listDbUsersByEmailPrefix(
  db: Kysely<Database>,
  emailPrefix: string,
): Promise<{ email: string | null; userId: string }[]> {
  const rows = await db
    .selectFrom('dwUser')
    .select(['userId', 'email'])
    .where(db =>
      db.or([
        db('email', 'ilike', `${emailPrefix}%`),
        db('pendingEmail', 'ilike', `${emailPrefix}%`),
      ]),
    )
    .execute();

  return rows.map(r => ({
    email: r.email?.toLowerCase() ?? null,
    userId: r.userId,
  }));
}

// ============================================================================
// MAIN
// ============================================================================

type Pool = { label: string; id: string };

async function buildPools(): Promise<Pool[]> {
  const primaryPoolId = await getUserPoolId();
  const irsPoolId = await getIrsUserPoolId();
  const pools: Pool[] = [{ label: 'primary', id: primaryPoolId }];
  if (irsPoolId) pools.push({ label: 'irs', id: irsPoolId });
  return pools;
}

async function runDbFirstCleanup({
  db,
  cognito,
  pools,
  emailPrefix,
}: {
  db: Kysely<Database>;
  cognito: CognitoIdentityProvider;
  pools: Pool[];
  emailPrefix: string;
}): Promise<void> {
  try {
    const dbUsers = await listDbUsersByEmailPrefix(db, emailPrefix);

    if (dbUsers.length === 0) {
      console.log(`[db] No users found with prefix "${emailPrefix}"`);
      return;
    }

    console.log(`[db] Found ${dbUsers.length} user(s) to delete`);

    await Promise.all(
      dbUsers.map(async ({ email, userId }) => {
        for (const pool of pools) {
          try {
            if (email) {
              await deleteCognitoUser({ cognito, email, userPoolId: pool.id });
            }
          } catch (e) {
            console.error(
              `[db][${pool.label}] Failed to delete Cognito user ${email}`,
              e,
            );
          }
        }

        try {
          await deleteAllUserRecords(db, userId);
        } catch (e) {
          console.error(`[db] Failed to delete DB records for ${userId}`, e);
        }
      }),
    );

    console.log('[db] Cleanup complete');
  } catch (err) {
    console.error('[db] Error during cleanup', err);
  }
}

async function runCognitoCleanupForPool({
  db,
  cognito,
  pool,
  emailPrefix,
}: {
  db: Kysely<Database>;
  cognito: CognitoIdentityProvider;
  pool: Pool;
  emailPrefix: string;
}): Promise<void> {
  try {
    const users = await listUsersByEmailPrefix({
      cognito,
      emailPrefix,
      userPoolId: pool.id,
    });

    if (users.length === 0) {
      console.log(
        `[${pool.label}] No users found with prefix "${emailPrefix}"`,
      );
      return;
    }

    console.log(`[${pool.label}] Found ${users.length} user(s) to delete`);

    await Promise.all(
      users.map(async ({ email, userId }) => {
        try {
          await deleteCognitoUser({ cognito, email, userPoolId: pool.id });
        } catch (e) {
          console.error(
            `[${pool.label}] Failed to delete Cognito user ${email}`,
            e,
          );
        }

        try {
          await deleteAllUserRecords(db, userId);
        } catch (e) {
          console.error(
            `[${pool.label}] Failed to delete DB records for ${userId}`,
            e,
          );
        }
      }),
    );

    console.log(`[${pool.label}] Cleanup complete`);
  } catch (err) {
    console.error(`[${pool.label}] Error during cleanup`, err);
  }
}

async function main(): Promise<void> {
  requireEnvVars(['ENV']);

  const cognito = new CognitoIdentityProvider({ region: AWS_REGION });
  const pools = await buildPools();

  // Establish a single DB connection for all deletes
  const db = await getDb();

  // Pass 1: DB-first - find users by email prefix in Postgres, delete from Cognito and Postgres
  await runDbFirstCleanup({
    cognito,
    db,
    emailPrefix: DEFAULT_EMAIL_PREFIX,
    pools,
  });

  // Pass 2: Cognito-driven - find users in each pool and delete remaining
  for (const pool of pools) {
    await runCognitoCleanupForPool({
      cognito,
      db,
      emailPrefix: DEFAULT_EMAIL_PREFIX,
      pool,
    });
  }
}

main().catch(err => {
  console.error('Unexpected error during cleanup', err);
  process.exit(1);
});
