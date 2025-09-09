#!/usr/bin/env -S npx ts-node --transpile-only

import { CognitoIdentityProvider, ListUsersCommandOutput, UserType } from '@aws-sdk/client-cognito-identity-provider';
import { Kysely } from 'kysely';
import type { Database } from '../../web-api/src/database-schema';
import { getConnection } from '../../web-api/src/getConnection';
import { getUserPoolId, requireEnvVars } from '../../shared/admin-tools/util';

// ============================================================================
// UTILITIES
// ============================================================================

// Config constants
const AWS_REGION = 'us-east-1';
const DEFAULT_EMAIL_PREFIX = 'cypress_test_account';
const COGNITO_DELETE_RPS = 30;
const COGNITO_DELETE_INTERVAL_MS = Math.round(1000 / COGNITO_DELETE_RPS); // ~34ms
const COGNITO_MAX_RETRIES = 5;
const COGNITO_BACKOFF_BASE_MS = 100; // base for exponential backoff
const COGNITO_JITTER_MS = 100; // add jitter to spread retries

type Args = {
  includeIrs: boolean;
  emailPrefix: string;
  dryRun: boolean;
  help: boolean;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    dryRun: false,
    emailPrefix: DEFAULT_EMAIL_PREFIX,
    help: false,
    includeIrs: true,
  };

  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if (token === '--help' || token === '-h') {
      args.help = true;
    } else if (token === '--dry-run') {
      args.dryRun = true;
    } else if (token === '--no-irs') {
      args.includeIrs = false;
    } else if (token === '--prefix') {
      const next = argv[i + 1];
      if (!next) throw new Error('Missing value for --prefix');
      args.emailPrefix = next;
      i++;
    } else if (token.startsWith('--prefix=')) {
      args.emailPrefix = token.split('=')[1] ?? args.emailPrefix;
    } else if (token === '--include-irs') {
      args.includeIrs = true;
    }
  }

  return args;
}

function printUsage(): void {
  console.log('Cleanup Cypress test accounts');
  console.log('');
  console.log('Usage:');
  console.log('  npx ts-node --transpile-only ./scripts/user/cleanup-cypress-test-accounts.ts [options]');
  console.log('');
  console.log('Options:');
  console.log('  --help, -h           Show this help');
  console.log('  --dry-run            List accounts that would be deleted without deleting');
  console.log('  --prefix <value>     Email prefix to match (default: cypress_test_account)');
  console.log('  --no-irs             Skip IRS user pool (default: include IRS if configured)');
}

function getIrsUserPoolId(): string | undefined {
  const pool = process.env.USER_POOL_IRS_ID;
  return pool && pool.length > 0 ? pool : undefined;
}

// Smooth rate limiter for Cognito deletes (≈30 req/sec → one op every ~34ms)
const rateLimitCognitoDelete = (() => {
  const queue: Array<() => void> = [];
  let timer: ReturnType<typeof setInterval> | null = null;

  const tick = () => {
    const next = queue.shift();
    if (!next) {
      if (timer) {
        clearInterval(timer as any);
        timer = null;
      }
      return;
    }
    next();
  };

  return async <T>(fn: () => Promise<T>): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      queue.push(() => {
        fn().then(resolve).catch(reject);
      });
      if (!timer) {
        timer = setInterval(tick, COGNITO_DELETE_INTERVAL_MS);
        const maybeUnref: any = timer as any;
        if (maybeUnref && typeof maybeUnref.unref === 'function') maybeUnref.unref();
      }
    });
})();

function sleep(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}

// ============================================================================
// COGNITO
// ============================================================================

function extractUserInfo(user: UserType): { email: string; userId: string } | null {
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
  await rateLimitCognitoDelete(async () => {
    try {
      await cognito.adminDeleteUser({
        UserPoolId: userPoolId,
        Username: email.toLowerCase(),
      });
    } catch (err: any) {
      const name = err?.name || err?.__type;
      // Swallow user not existing
      if (name === 'UserNotFoundException') {
        return;
      }
      // Handle throttling with retries + jitter
      if (name === 'TooManyRequestsException' || name === 'LimitExceededException' || name === 'ThrottlingException') {
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
          } catch (e2: any) {
            const n2 = e2?.name || e2?.__type;
            if (n2 === 'UserNotFoundException') return;
            if (!(n2 === 'TooManyRequestsException' || n2 === 'LimitExceededException' || n2 === 'ThrottlingException')) {
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

async function deleteAllUserRecords(db: Kysely<Database>, userId: string): Promise<void> {
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
): Promise<{ email: string; userId: string }[]> {
  const rows = await db
    .selectFrom('dwUser')
    .select(['userId', 'email'])
    .where('email', 'like', `${emailPrefix}%`)
    .execute();

  return rows
    .filter((r): r is { userId: string; email: string } => !!r.email)
    .map(r => ({ email: r.email.toLowerCase(), userId: r.userId }));
}

// ============================================================================
// MAIN
// ============================================================================

type Pool = { label: string; id: string };

async function buildPools(includeIrs: boolean): Promise<Pool[]> {
  const primaryPoolId = await getUserPoolId();
  const irsPoolId = includeIrs ? await getIrsUserPoolId() : undefined;
  const pools: Pool[] = [{ label: 'primary', id: primaryPoolId }];
  if (irsPoolId) pools.push({ label: 'irs', id: irsPoolId });
  return pools;
}

async function runDbFirstCleanup({
  db,
  cognito,
  pools,
  emailPrefix,
  dryRun,
}: {
  db: Kysely<Database>;
  cognito: CognitoIdentityProvider;
  pools: Pool[];
  emailPrefix: string;
  dryRun: boolean;
}): Promise<void> {
  try {
    const dbUsers = await listDbUsersByEmailPrefix(db, emailPrefix);

    if (dbUsers.length === 0) {
      console.log(`[db] No users found with prefix "${emailPrefix}"`);
      return;
    }

    console.log(`[db] Found ${dbUsers.length} user(s) to delete`);
    if (dryRun) {
      dbUsers.forEach(u => console.log(`[dry-run][db] ${u.email} (${u.userId})`));
      return;
    }

    await Promise.all(
      dbUsers.map(async ({ email, userId }) => {
        for (const pool of pools) {
          try {
            await deleteCognitoUser({ cognito, email, userPoolId: pool.id });
          } catch (e) {
            console.error(`[db][${pool.label}] Failed to delete Cognito user ${email}`, e);
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
  dryRun,
}: {
  db: Kysely<Database>;
  cognito: CognitoIdentityProvider;
  pool: Pool;
  emailPrefix: string;
  dryRun: boolean;
}): Promise<void> {
  try {
    const users = await listUsersByEmailPrefix({
      cognito,
      emailPrefix,
      userPoolId: pool.id,
    });

    if (users.length === 0) {
      console.log(`[${pool.label}] No users found with prefix "${emailPrefix}"`);
      return;
    }

    console.log(`[${pool.label}] Found ${users.length} user(s) to delete`);
    if (dryRun) {
      users.forEach(u => console.log(`[dry-run] ${u.email} (${u.userId})`));
      return;
    }

    await Promise.all(
      users.map(async ({ email, userId }) => {
        try {
          await deleteCognitoUser({ cognito, email, userPoolId: pool.id });
        } catch (e) {
          console.error(`[${pool.label}] Failed to delete Cognito user ${email}`, e);
        }

        try {
          await deleteAllUserRecords(db, userId);
        } catch (e) {
          console.error(`[${pool.label}] Failed to delete DB records for ${userId}`, e);
        }
      }),
    );

    console.log(`[${pool.label}] Cleanup complete`);
  } catch (err) {
    console.error(`[${pool.label}] Error during cleanup`, err);
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv);
  if (args.help) {
    printUsage();
    return;
  }

  requireEnvVars(['ENV']);

  const cognito = new CognitoIdentityProvider({ region: AWS_REGION });
  const pools = await buildPools(args.includeIrs);

  // Establish a single DB connection for all deletes
  const db = await getConnection({ cb: r => r });

  // Pass 1: DB-first - find users by email prefix in Postgres, delete from Cognito and Postgres
  await runDbFirstCleanup({
    cognito,
    db,
    dryRun: args.dryRun,
    emailPrefix: args.emailPrefix,
    pools,
  });

  // Pass 2: Cognito-driven - find users in each pool and delete remaining
  for (const pool of pools) {
    await runCognitoCleanupForPool({
      cognito,
      db,
      dryRun: args.dryRun,
      emailPrefix: args.emailPrefix,
      pool,
    });
  }
}

main().catch(err => {
  console.error('Unexpected error during cleanup', err);
  process.exit(1);
});


