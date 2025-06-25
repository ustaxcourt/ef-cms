jest.mock('@web-api/persistence/postgres/utils/operation/pgInsertInto', () => ({
  pgInsertInto: jest.fn(),
}));

import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createNewPetitionerUser } from './createNewPetitionerUser';

describe('createNewPetitionerUser', () => {
  const mockUser = {
    entityName: 'User',
    name: 'Bob Ross',
    pendingEmail: 'petitioner@example.com',
    role: ROLES.petitioner,
    section: 'petitioner',
    userId: 'e6df170d-bc7d-428b-b0f2-decb3f9b83a8',
  };

  it('should make a call to create the specified user in persistence', async () => {
    await createNewPetitionerUser({
      applicationContext,
      user: mockUser,
    });

    expect(applicationContext.getUserGateway().createUser).toHaveBeenCalledWith(
      applicationContext,
      {
        email: mockUser.pendingEmail,
        name: mockUser.name,
        role: mockUser.role,
        sendWelcomeEmail: true,
        userId: mockUser.userId,
      },
    );
    expect(pgInsertInto).toHaveBeenCalledWith({
      values: 'a',
    });
  });
});
