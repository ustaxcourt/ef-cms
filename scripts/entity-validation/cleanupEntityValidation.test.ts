import { deleteSSMItem } from '../../shared/admin-tools/aws/ssmHelper';
import { main } from './cleanupEntityValidation';

jest.mock('../../shared/admin-tools/aws/ssmHelper', () => ({
  deleteSSMItem: jest.fn(),
}));

describe('cleanupEntityValidation', () => {
  // Hoisted to describe scope so they intercept the module-level main() call
  // that fires on import, before any beforeEach runs.
  const mockProcessExit = jest
    .spyOn(process, 'exit')
    .mockImplementation(() => undefined as never);
  const mockConsoleLog = jest
    .spyOn(console, 'log')
    .mockImplementation(() => {});
  const mockConsoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  beforeEach(() => {
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
    mockProcessExit.mockClear();
  });

  afterAll(() => {
    mockProcessExit.mockRestore();
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  it('should call deleteSSMItem and then exit with code 0', async () => {
    (deleteSSMItem as jest.Mock).mockResolvedValue(undefined);

    await main();
    expect(deleteSSMItem).toHaveBeenCalledWith('entity-validation-required');
    expect(mockProcessExit).toHaveBeenCalledWith(0);
  });

  it('should log an error and exit with code 1 when deleteSSMItem throws', async () => {
    (deleteSSMItem as jest.Mock).mockRejectedValue(new Error('SSM error'));

    await main();

    expect(console.error).toHaveBeenCalledWith(
      'failed to delete ssm parameter for entity validation',
    );
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });

  it('should log and exit with 1 when cleanupEntityValidation itself rejects unexpectedly', async () => {
    // Force the outer .catch in main() by making process.exit throw after the
    // inner catch already called it, causing cleanupEntityValidation to reject.
    (deleteSSMItem as jest.Mock).mockRejectedValue(new Error('unexpected'));
    mockProcessExit
      .mockImplementationOnce(() => {
        throw new Error('process.exit(1) called');
      })
      .mockImplementation();

    await main();

    expect(console.log).toHaveBeenCalledWith('Error:', expect.any(Error));
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });
});
