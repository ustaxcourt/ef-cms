import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { MOCK_CASE } from '@shared/test/mockCase';

jest.mock('@web-api/persistence/postgres/utils/operation/pgInsertInto', () => ({
  pgInsertInto: jest.fn(),
}));
jest.mock(
  '@web-api/persistence/postgres/geocodeData/getLatLngByCityState',
  () => ({
    getLatLngByCityState: jest.fn(),
  }),
);

const { pgInsertInto } = jest.requireMock(
  '@web-api/persistence/postgres/utils/operation/pgInsertInto',
);
const { getLatLngByCityState } = jest.requireMock(
  '@web-api/persistence/postgres/geocodeData/getLatLngByCityState',
);

describe('upsertCases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds lat/lng to petitioners before persisting', async () => {
    getLatLngByCityState.mockResolvedValue({ lat: 35.2, lng: -89.9 });

    await upsertCases([MOCK_CASE]);

    expect(pgInsertInto).toHaveBeenCalledTimes(1);
    const { values } = pgInsertInto.mock.calls[0][0];
    const savedCase = values[0];
    const petitioners = JSON.parse(savedCase.petitioners);
    expect(petitioners[0].lat).toBe(35.2);
    expect(petitioners[0].lng).toBe(-89.9);
  });
});
