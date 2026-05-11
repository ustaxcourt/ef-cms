jest.mock('node:child_process', () => ({
  execFile: jest.fn(),
}));

import { execFile } from 'node:child_process';
import { qpdfMerge, qpdfPageCount } from './qpdf';

type Callback = (
  err: (Error & { code?: number; stdout?: string; stderr?: string }) | null,
  result?: { stdout: string; stderr: string },
) => void;

const execFileMock = execFile as unknown as jest.Mock;

// promisify(execFile) calls execFile(file, args, callback). Helpers to
// drive the callback toward success / warnings / error / ENOENT.
const respondSuccess = (stdout = '', stderr = '') => {
  execFileMock.mockImplementation(
    (_file: string, _args: string[], cb: Callback) => cb(null, { stdout, stderr }),
  );
};

const respondWithExitCode = (
  code: number,
  { stdout = '', stderr = '' }: { stdout?: string; stderr?: string } = {},
) => {
  execFileMock.mockImplementation(
    (_file: string, _args: string[], cb: Callback) => {
      const err = Object.assign(new Error(`Command failed with exit ${code}`), {
        code,
        stdout,
        stderr,
      });
      cb(err);
    },
  );
};

const respondWithEnoent = () => {
  execFileMock.mockImplementation(
    (_file: string, _args: string[], cb: Callback) => {
      const err = Object.assign(new Error('spawn qpdf ENOENT'), {
        code: 'ENOENT',
      });
      cb(err as Error & { code: number });
    },
  );
};

describe('qpdf wrapper', () => {
  beforeEach(() => {
    execFileMock.mockReset();
  });

  describe('qpdfMerge', () => {
    it('invokes qpdf with --empty --pages <inputs> -- <output>', async () => {
      respondSuccess();
      await qpdfMerge({
        inputs: ['/tmp/a.pdf', '/tmp/b.pdf', '/tmp/c.pdf'],
        output: '/tmp/out.pdf',
      });
      expect(execFileMock).toHaveBeenCalledTimes(1);
      const [file, args] = execFileMock.mock.calls[0];
      expect(file).toBe('qpdf');
      expect(args).toEqual([
        '--empty',
        '--pages',
        '/tmp/a.pdf',
        '/tmp/b.pdf',
        '/tmp/c.pdf',
        '--',
        '/tmp/out.pdf',
      ]);
    });

    it('rejects when called with no inputs (defensive — qpdf would silently produce empty output otherwise)', async () => {
      await expect(
        qpdfMerge({ inputs: [], output: '/tmp/out.pdf' }),
      ).rejects.toThrow(/at least one input/);
    });

    it('accepts exit code 3 (warnings) as success-with-warnings', async () => {
      respondWithExitCode(3, { stderr: 'WARNING: object stream issue' });
      await expect(
        qpdfMerge({ inputs: ['/tmp/a.pdf'], output: '/tmp/out.pdf' }),
      ).resolves.toBeUndefined();
    });

    it('rejects with a useful message when qpdf exits 2 (hard error)', async () => {
      respondWithExitCode(2, { stderr: 'attempting to read past EOF' });
      await expect(
        qpdfMerge({ inputs: ['/tmp/a.pdf'], output: '/tmp/out.pdf' }),
      ).rejects.toThrow(/qpdf failed \(exit 2\).*EOF/s);
    });

    it('rejects with a self-diagnosing ENOENT message pointing at the dev setup docs', async () => {
      respondWithEnoent();
      await expect(
        qpdfMerge({ inputs: ['/tmp/a.pdf'], output: '/tmp/out.pdf' }),
      ).rejects.toThrow(/brew install qpdf/);
    });
  });

  describe('qpdfPageCount', () => {
    it('invokes qpdf --show-npages and parses the integer result', async () => {
      respondSuccess('2533\n');
      const n = await qpdfPageCount('/tmp/in.pdf');
      expect(n).toBe(2533);
      expect(execFileMock).toHaveBeenCalledWith(
        'qpdf',
        ['--show-npages', '/tmp/in.pdf'],
        expect.any(Function),
      );
    });

    it('accepts exit 3 and still parses stdout (qpdf prints the count even with warnings)', async () => {
      respondWithExitCode(3, { stdout: '132013\n', stderr: 'WARNING: …' });
      const n = await qpdfPageCount('/tmp/in.pdf');
      expect(n).toBe(132013);
    });
  });
});
