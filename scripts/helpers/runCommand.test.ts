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
});
