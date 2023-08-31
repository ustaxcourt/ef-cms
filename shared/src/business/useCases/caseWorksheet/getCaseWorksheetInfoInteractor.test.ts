import { UnauthorizedError } from '../../../errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getCaseWorksheetInfoInteractor } from './getCaseWorksheetInfoInteractor';
import { petitionsClerkUser } from '@shared/test/mockUsers';

describe('getCaseWorksheetInfoInteractor', () => {
  beforeEach(() => {});

  it('should throw an erorr when the user does not have permission to the case worksheet feature', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    await expect(
      getCaseWorksheetInfoInteractor(applicationContext),
    ).rejects.toThrow(UnauthorizedError);
  });
});
