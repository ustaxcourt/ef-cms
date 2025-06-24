import { runCommand } from '../helpers/runCommand';
import { trim } from 'lodash';

export const getRepoName = async (): Promise<string> => {
  const fullRepoName = trim(
    await runCommand('git', ['config', '--get', 'remote.origin.url']),
  );
  return trim(await runCommand('basename', ['-s', '.git', fullRepoName]));
};

export const getLowerEnvAccountId = async (): Promise<string> => {
  return trim(
    await runCommand('aws', [
      'sts',
      'get-caller-identity',
      '--query',
      'Account',
      '--output',
      'text',
    ]),
  );
};

export const getLowerEnvSsoRoleId = async (): Promise<string> => {
  const callerIdentityArn = trim(
    await runCommand('aws', [
      'sts',
      'get-caller-identity',
      '--query',
      'Arn',
      '--output',
      'text',
    ]),
  );
  return callerIdentityArn.split('/')[1];
};
