import { spawn } from 'child_process';
import { trim } from 'lodash';

export const runCommand = async (
  cmd: string,
  options: string[],
): Promise<string> => {
  return new Promise((resolve, reject) => {
    let output: string;
    const result = spawn(cmd, options, {
      env: { ...process.env },
      stdio: 'pipe',
    });
    result.stdout.on('data', data => {
      if (!output) {
        output = data.toString('utf-8');
      } else {
        output += data.toString('utf-8');
      }
    });
    result.stderr.on('data', data => {
      console.error(trim(data.toString('utf-8')));
    });
    result.on('close', code => {
      if (code || !output) {
        const command = `${cmd} ${options.join(' ')}`;
        reject(new Error(`Unable to run ${command}`));
      } else {
        resolve(trim(output));
      }
    });
  });
};
