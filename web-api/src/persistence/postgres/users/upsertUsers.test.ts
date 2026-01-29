import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';
import { irsPractitionerUser } from '@shared/test/mockUsers';
import { RawUser } from '@shared/business/entities/User';

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

describe('upsertUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds lat/lng to user and contact from geocode data', async () => {
    getLatLngByCityState.mockResolvedValue({ lat: 38.9, lng: -77.0 });

    await upsertUsers([irsPractitionerUser]);

    expect(pgInsertInto).toHaveBeenCalledTimes(1);
    const { values } = pgInsertInto.mock.calls[0][0];
    const savedUser = values[0];
    expect(savedUser.lat).toBe(38.9);
    expect(savedUser.lng).toBe(-77.0);

    const contact = JSON.parse(savedUser.contact);
    expect(contact.lat).toBe(38.9);
    expect(contact.lng).toBe(-77.0);
  });

  it('sets lat/lng to null when no geocode match', async () => {
    getLatLngByCityState.mockResolvedValue(null);
    const userWithoutState: RawUser = {
      ...irsPractitionerUser,
      contact: {
        ...irsPractitionerUser.contact!,
        state: undefined,
      },
    };

    await upsertUsers([userWithoutState]);

    const { values } = pgInsertInto.mock.calls[0][0];
    const savedUser = values[0];
    expect(savedUser.lat).toBeNull();
    expect(savedUser.lng).toBeNull();
  });
});
