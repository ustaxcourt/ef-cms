import { runCommand } from './runCommand';

describe('runCommand', () => {
  it('captures stdout by default and returns it trimmed', async () => {
    const output = await runCommand('echo', ['hello world']);
    expect(output).toBe('hello world');
  });

  it('streams stdout to the parent process when streamStdout is true', async () => {
    const writeSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    const output = await runCommand('echo', ['streaming'], undefined, {
      streamStdout: true,
    });
    expect(output).toBe('streaming');
    expect(writeSpy).toHaveBeenCalled();
    const wroteStreaming = (writeSpy.mock.calls as unknown as any[][]).some(
      args =>
        args.some(arg =>
          typeof arg === 'string'
            ? arg.includes('streaming')
            : arg?.toString()?.includes('streaming'),
        ),
    );
    expect(wroteStreaming).toBe(true);
    writeSpy.mockRestore();
  });

  it('does not capture stdout when captureStdout is false, returning an empty string', async () => {
    const output = await runCommand('echo', ['no-capture'], undefined, {
      captureStdout: false,
      streamStdout: true,
    });
    expect(output).toBe('');
  });

  it('passes envvars to the spawned process', async () => {
    const output = await runCommand('sh', ['-c', 'echo $MY_VAR'], {
      MY_VAR: 'hello',
    });
    expect(output).toBe('hello');
  });

  it('handles multiple chunks of stdout', async () => {
    const output = await runCommand('sh', [
      '-c',
      'echo chunk1; sleep 0.1; echo chunk2',
    ]);
    expect(output).toBe('chunk1\nchunk2');
  });

  it('captures stderr and rejects on non-zero exit code', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    await expect(
      runCommand('sh', ['-c', 'echo "some error" >&2; exit 1']),
    ).rejects.toThrow(
      'Error: `sh -c echo "some error" >&2; exit 1` exited with code 1\nsome error',
    );
    expect(consoleSpy).toHaveBeenCalledWith('some error');
    consoleSpy.mockRestore();
  });

  it('handles multiple chunks of stderr', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    await expect(
      runCommand('sh', [
        '-c',
        'echo err1 >&2; sleep 0.1; echo err2 >&2; exit 1',
      ]),
    ).rejects.toThrow(/err1\nerr2/);
    consoleSpy.mockRestore();
  });

  it('works without params', async () => {
    const output = await runCommand('true');
    expect(output).toBe('');
  });

  it('rejects without params', async () => {
    await expect(runCommand('false')).rejects.toThrow(
      'Error: `false` exited with code 1',
    );
  });
});
