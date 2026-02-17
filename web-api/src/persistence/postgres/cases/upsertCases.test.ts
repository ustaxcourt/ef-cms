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

  it('returns early without calling pgInsertInto when rawCases is empty', async () => {
    await upsertCases([]);

    expect(pgInsertInto).not.toHaveBeenCalled();
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

  it('maps and inserts multiple cases into dwCase table', async () => {
    const secondCase = { ...MOCK_CASE, docketNumber: '102-18' };
    await upsertCases([MOCK_CASE, secondCase]);

    expect(pgInsertInto).toHaveBeenCalledTimes(1);
    expect(pgInsertInto).toHaveBeenCalledWith({
      table: 'dwCase',
      values: expect.arrayContaining([
        expect.objectContaining({ docketNumber: '101-18' }),
        expect.objectContaining({ docketNumber: '102-18' }),
      ]),
      onConflictColumns: ['docketNumber'],
    });
  });
});
