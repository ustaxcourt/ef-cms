import { deleteSSMItem } from '../../shared/admin-tools/aws/ssmHelper';
import { main } from './cleanupEntityValidation';

jest.mock('../../shared/admin-tools/aws/ssmHelper', () => ({
  deleteSSMItem: jest.fn(),
}));

describe('cleanupEntityValidation', () => {
  const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();
  it('should call deleteSSMItem and then exit with code 0', async () => {
    // test the cleanupEntityValidation script
    (deleteSSMItem as jest.Mock).mockResolvedValue(undefined);

    await main();
    expect(deleteSSMItem).toHaveBeenCalledWith('entity-validation-required');
    expect(mockProcessExit).toHaveBeenCalledWith(0);
  });
});
