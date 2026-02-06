import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { MOCK_CASE } from '@shared/test/mockCase';

jest.mock('@web-api/persistence/postgres/utils/operation/pgInsertInto', () => ({
  pgInsertInto: jest.fn(),
}));

const { pgInsertInto } = jest.requireMock(
  '@web-api/persistence/postgres/utils/operation/pgInsertInto',
);

describe('upsertCases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inserts cases into dwCase table', async () => {
    await upsertCases([MOCK_CASE]);

    expect(pgInsertInto).toHaveBeenCalledTimes(1);
    expect(pgInsertInto).toHaveBeenCalledWith({
      table: 'dwCase',
      values: expect.any(Array),
      onConflictColumns: ['docketNumber'],
    });
  });
});
