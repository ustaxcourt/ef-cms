import { runCommand } from '../helpers/runCommand';

export const getRepoName = async (): Promise<string> => {
  const fullRepoName = await runCommand('git', [
    'config',
    '--get',
    'remote.origin.url',
  ]);
  return runCommand('basename', ['-s', '.git', fullRepoName]);
};

export const getLowerEnvAccountId = async (): Promise<string> => {
  return runCommand('aws', [
    'sts',
    'get-caller-identity',
    '--query',
    'Account',
    '--output',
    'text',
  ]);
};

export const getLowerEnvSsoRoleId = async (): Promise<string> => {
  const callerIdentityArn = await runCommand('aws', [
    'sts',
    'get-caller-identity',
    '--query',
    'Arn',
    '--output',
    'text',
  ]);
  return callerIdentityArn.split('/')[1];
};
