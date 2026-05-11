import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);

// qpdf returns 0 for success, 2 for errors, and 3 for "warnings, but the
// output was still produced and is usable" — which we accept because most
// real-world filings carry minor PDF spec warnings the recipient tooling
// already tolerates.
const QPDF_OK_EXIT_CODES = new Set([0, 3]);

// `child_process.execFile` rejects with an Error that carries `code`,
// `stdout`, and `stderr`. We re-throw shaped errors so callers don't have
// to depend on the node-internal shape.
type ExecError = Error & {
  code?: number;
  stdout?: string;
  stderr?: string;
};

function isExecError(err: unknown): err is ExecError {
  return err instanceof Error && 'code' in err;
}

async function runQpdf(args: string[]): Promise<{ stdout: string; stderr: string }> {
  try {
    return await execFileP('qpdf', args);
  } catch (err: unknown) {
    if (isExecError(err)) {
      if (typeof err.code === 'number' && QPDF_OK_EXIT_CODES.has(err.code)) {
        return { stdout: err.stdout ?? '', stderr: err.stderr ?? '' };
      }
      // ENOENT — binary missing on PATH. Most likely a dev environment that
      // skipped `brew install qpdf`. Re-throw with a self-diagnosing message.
      if ('code' in err && (err as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(
          'qpdf binary not found on PATH. Install it locally with `brew install qpdf`; in deployed environments it ships in the qpdf Lambda layer at web-api/runtimes/qpdf.',
        );
      }
      throw new Error(
        `qpdf failed (exit ${err.code ?? 'unknown'}): ${(err.stderr ?? err.message).trim()}`,
      );
    }
    throw err;
  }
}

// Concatenate one or more input PDFs into a single output PDF. qpdf's
// `--pages` flag rewrites the page tree by xref manipulation; it does not
// re-serialize page content, so this stays fast and memory-flat even with
// six-figure page counts.
export const qpdfMerge = async ({
  inputs,
  output,
}: {
  inputs: string[];
  output: string;
}): Promise<void> => {
  if (inputs.length === 0) {
    throw new Error('qpdfMerge requires at least one input path');
  }
  await runQpdf(['--empty', '--pages', ...inputs, '--', output]);
};

export const qpdfPageCount = async (input: string): Promise<number> => {
  const { stdout } = await runQpdf(['--show-npages', input]);
  return parseInt(stdout.trim(), 10);
};
