#!/usr/bin/env -S npx ts-node --transpile-only

import { CognitoIdentityProvider, ListUsersCommandOutput, UserType } from '@aws-sdk/client-cognito-identity-provider';
import { Kysely } from 'kysely';
import type { Database } from '../../web-api/src/database-schema';
import { getConnection } from '../../web-api/src/getConnection';
import { getUserPoolId, requireEnvVars } from '../../shared/admin-tools/util';

type Args = {
  includeIrs: boolean;
  emailPrefix: string;
  dryRun: boolean;
  help: boolean;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    dryRun: false,
    emailPrefix: 'cypress_test_account',
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
  await cognito.adminDeleteUser({
    UserPoolId: userPoolId,
    Username: email.toLowerCase(),
  });
}

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

async function main(): Promise<void> {
  const args = parseArgs(process.argv);
  if (args.help) {
    printUsage();
    return;
  }

  requireEnvVars(['ENV']);

  const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });

  const primaryPoolId = await getUserPoolId();
  const irsPoolId = args.includeIrs ? await getIrsUserPoolId() : undefined;

  const pools: { label: string; id: string }[] = [{ label: 'primary', id: primaryPoolId }];
  if (irsPoolId) pools.push({ label: 'irs', id: irsPoolId });

  // Establish a single DB connection for all deletes
  const db = await getConnection({ cb: r => r });

  for (const pool of pools) {
    try {
      const users = await listUsersByEmailPrefix({
        cognito,
        emailPrefix: args.emailPrefix,
        userPoolId: pool.id,
      });

      if (users.length === 0) {
        console.log(`[${pool.label}] No users found with prefix "${args.emailPrefix}"`);
        continue;
      }

      console.log(`[${pool.label}] Found ${users.length} user(s) to delete`);
      if (args.dryRun) {
        users.forEach(u => console.log(`[dry-run] ${u.email} (${u.userId})`));
        continue;
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
}

main().catch(err => {
  console.error('Unexpected error during cleanup', err);
  process.exit(1);
});


