import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';
import { irsPractitionerUser } from '@shared/test/mockUsers';

jest.mock('@web-api/persistence/postgres/utils/operation/pgInsertInto', () => ({
  pgInsertInto: jest.fn(),
}));

const { pgInsertInto } = jest.requireMock(
  '@web-api/persistence/postgres/utils/operation/pgInsertInto',
);

describe('upsertUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inserts users into dwUser table', async () => {
    await upsertUsers([irsPractitionerUser]);

    expect(pgInsertInto).toHaveBeenCalledTimes(1);
    expect(pgInsertInto).toHaveBeenCalledWith({
      table: 'dwUser',
      values: expect.any(Array),
      onConflictColumns: ['userId'],
    });
  });
});
