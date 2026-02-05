import { spawn } from 'child_process';
import { trim } from 'lodash';

export const runCommand = async (
  cmd: string,
  params?: string[],
  envvars?: { [key: string]: string },
  {
    captureStdout = true,
    streamStdout = false,
  }: { captureStdout?: boolean; streamStdout?: boolean } = {},
): Promise<string> => {
  const env = envvars ? { ...process.env, ...envvars } : { ...process.env };
  return new Promise((resolve, reject) => {
    let stdout: string;
    let stderr: string;
    const result = spawn(cmd, params, { env, stdio: 'pipe' });
    result.stdout.on('data', data => {
      if (streamStdout) {
        process.stdout.write(data);
      }
      if (captureStdout) {
        if (!stdout) {
          stdout = data.toString('utf-8');
        } else {
          stdout += data.toString('utf-8');
        }
      }
    });
    result.stderr.on('data', data => {
      console.error(trim(data.toString('utf-8')));
      if (!stderr) {
        stderr = data.toString('utf-8');
      } else {
        stderr += data.toString('utf-8');
      }
    });
    result.on('close', code => {
      if (code) {
        const command = trim(`${cmd} ${params?.join(' ') ?? ''}`);
        const message = `Error: \`${command}\` exited with code ${code}\n${trim(stderr)}`;
        reject(new Error(message));
      } else {
        resolve(trim(stdout));
      }
    });
  });
};
