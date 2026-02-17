jest.mock('@web-api/database');
jest.mock('../helpers/prompts', () => ({
  ask: jest.fn(),
}));
jest.mock('us-census-geocoder');
jest.mock('@web-api/persistence/postgres/userContacts/upsertUserContacts');

import { backfillUserGeocodes } from './backfillUserGeocodes';
import { getDbReader as getDbReaderMock } from '@web-api/database';
import { ask as askMock } from '../helpers/prompts';
import { Geocoder as GeocoderConstructor } from 'us-census-geocoder';
import { upsertUserContacts as upsertUserContactsMock } from '@web-api/persistence/postgres/userContacts/upsertUserContacts';
import { createChainable } from '../helpers/createChainable';

const getDbReader = jest.mocked(getDbReaderMock);
const ask = jest.mocked(askMock);
const Geocoder = jest.mocked(GeocoderConstructor);
const upsertUserContacts = jest.mocked(upsertUserContactsMock);

const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(jest.fn());

describe('backfillUserGeocodes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    upsertUserContacts.mockResolvedValue(undefined);
  });

  it('exits early when count is 0', async () => {
    getDbReader.mockImplementation(cb => {
      const chain = createChainable(null, { count: 0 });
      const mockDb = { selectFrom: () => chain };
      return Promise.resolve(cb(mockDb as any));
    });

    await backfillUserGeocodes({});

    expect(mockConsoleLog).toHaveBeenCalledWith(
      'There are no addresses to geocode in this range',
    );
    expect(ask).not.toHaveBeenCalled();
  });

  it('exits when user declines', async () => {
    let callCount = 0;
    getDbReader.mockImplementation(cb => {
      callCount++;
      const result = callCount === 1 ? { count: 5 } : [];
      const chain = createChainable(result, result);
      const mockDb = { selectFrom: () => chain };
      return Promise.resolve(cb(mockDb as any));
    });
    ask.mockResolvedValue('n');

    await backfillUserGeocodes({});

    expect(ask).toHaveBeenCalledWith(
      'You are about to geocode 5 addresses. Proceed? y/n ',
    );
    expect(upsertUserContacts).not.toHaveBeenCalled();
  });

  it('exits when user enters non-y', async () => {
    let callCount = 0;
    getDbReader.mockImplementation(cb => {
      callCount++;
      const result = callCount === 1 ? { count: 5 } : [];
      const chain = createChainable(result, result);
      const mockDb = { selectFrom: () => chain };
      return Promise.resolve(cb(mockDb as any));
    });
    ask.mockResolvedValue('N');

    await backfillUserGeocodes({});

    expect(ask).toHaveBeenCalled();
    expect(upsertUserContacts).not.toHaveBeenCalled();
  });

  it('exits when user enters no', async () => {
    let callCount = 0;
    getDbReader.mockImplementation(cb => {
      callCount++;
      const result = callCount === 1 ? { count: 5 } : [];
      const chain = createChainable(result, result);
      const mockDb = { selectFrom: () => chain };
      return Promise.resolve(cb(mockDb as any));
    });
    ask.mockResolvedValue('no');

    await backfillUserGeocodes({});

    expect(upsertUserContacts).not.toHaveBeenCalled();
  });

  it('proceeds when user confirms with y', async () => {
    let callCount = 0;
    getDbReader.mockImplementation(cb => {
      callCount++;
      const result = callCount === 1 ? { count: 5 } : [];
      const chain = createChainable(result, result);
      const mockDb = { selectFrom: () => chain };
      return Promise.resolve(cb(mockDb as any));
    });
    ask.mockResolvedValue('y');

    const mockGeocode = jest.fn().mockResolvedValue(undefined);
    const mockAdd = jest.fn();
    Geocoder.mockImplementation(
      () =>
        ({
          add: mockAdd,
          geocode: mockGeocode,
        }) as any,
    );

    await backfillUserGeocodes({});

    expect(ask).toHaveBeenCalledWith(
      'You are about to geocode 5 addresses. Proceed? y/n ',
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      'Starting geocode backfill (batchSize=10000, delayMs=6000)',
    );
    expect(mockConsoleLog).toHaveBeenCalledWith('No more users to process');
  });

  it('proceeds when user confirms with uppercase Y', async () => {
    let callCount = 0;
    getDbReader.mockImplementation(cb => {
      callCount++;
      const result = callCount === 1 ? { count: 2 } : [];
      const chain = createChainable(result, result);
      const mockDb = { selectFrom: () => chain };
      return Promise.resolve(cb(mockDb as any));
    });
    ask.mockResolvedValue('Y');

    const mockGeocode = jest.fn().mockResolvedValue(undefined);
    Geocoder.mockImplementation(
      () =>
        ({
          add: jest.fn(),
          geocode: mockGeocode,
        }) as any,
    );

    await backfillUserGeocodes({});

    expect(mockConsoleLog).toHaveBeenCalledWith('No more users to process');
  });

  it('exits loop when no users returned', async () => {
    let callCount = 0;
    getDbReader.mockImplementation(cb => {
      callCount++;
      const result = callCount === 1 ? { count: 5 } : [];
      const chain = createChainable(result, result);
      const mockDb = { selectFrom: () => chain };
      return Promise.resolve(cb(mockDb as any));
    });
    ask.mockResolvedValue('y');

    await backfillUserGeocodes({});

    expect(mockConsoleLog).toHaveBeenCalledWith('No more users to process');
    expect(mockConsoleLog).toHaveBeenCalledWith('\nBackfill complete:');
    expect(mockConsoleLog).toHaveBeenCalledWith('  Total processed: 0');
  });

  it('geocode flow invokes Geocoder and upsertUserContacts with geocoded data', async () => {
    const mockUsers = [
      {
        docketNumber: '101-20',
        userId: 'user-1',
        address1: '123 Main St',
        city: 'Washington',
        state: 'DC',
        zip: '20001',
      },
    ];

    let callCount = 0;
    getDbReader.mockImplementation(cb => {
      callCount++;
      const result =
        callCount === 1 ? { count: 1 } : callCount === 2 ? mockUsers : [];
      const chain = createChainable(result, result);
      const mockDb = { selectFrom: () => chain };
      return Promise.resolve(cb(mockDb as any));
    });
    ask.mockResolvedValue('y');

    let addCallback: (response: { lat: number; lon: number }) => void;
    const mockAdd = jest.fn((_id, _addr, cb: typeof addCallback) => {
      addCallback = cb;
    });
    const mockGeocode = jest.fn().mockImplementation(() => {
      addCallback?.({ lat: 38.9, lon: -77.0 });
      return Promise.resolve();
    });

    Geocoder.mockImplementation(
      () =>
        ({
          add: mockAdd,
          geocode: mockGeocode,
        }) as any,
    );

    await backfillUserGeocodes({});

    expect(mockAdd).toHaveBeenCalledWith(
      'user-1-101-20',
      {
        address: '123 Main St',
        city: 'Washington',
        state: 'DC',
        zip: '20001',
      },
      expect.any(Function),
    );
    expect(mockGeocode).toHaveBeenCalled();
    expect(upsertUserContacts).toHaveBeenCalledWith([
      {
        userId: 'user-1',
        docketNumber: '101-20',
        lat: 38.9,
        lng: -77.0,
        geodataMatch: true,
      },
    ]);
  });

  it('processes multiple batches', async () => {
    const firstBatch = [
      {
        docketNumber: '101-20',
        userId: 'user-1',
        address1: '123 Main St',
        city: 'Washington',
        state: 'DC',
        zip: '20001',
      },
      {
        docketNumber: '102-20',
        userId: 'user-2',
        address1: '456 Oak Ave',
        city: 'Arlington',
        state: 'VA',
        zip: '22201',
      },
      {
        docketNumber: '103-20',
        userId: 'user-3',
        address1: '789 Pine Rd',
        city: 'Alexandria',
        state: 'VA',
        zip: '22301',
      },
    ];

    let callCount = 0;
    getDbReader.mockImplementation(cb => {
      callCount++;
      const result =
        callCount === 1 ? { count: 10 } : callCount === 2 ? firstBatch : [];
      const chain = createChainable(result, result);
      const mockDb = { selectFrom: () => chain };
      return Promise.resolve(cb(mockDb as any));
    });
    ask.mockResolvedValue('y');

    const mockAdd = jest.fn(
      (_id, _addr, cb: (r: { lat: number; lon: number }) => void) => {
        cb({ lat: 38.9, lon: -77.0 });
      },
    );
    Geocoder.mockImplementation(
      () =>
        ({
          add: mockAdd,
          geocode: jest.fn().mockResolvedValue(undefined),
        }) as any,
    );

    await backfillUserGeocodes({});

    expect(mockConsoleLog).toHaveBeenCalledWith(
      'Processing batch of 3 users...',
    );
    expect(mockConsoleLog).toHaveBeenCalledWith('Completed 3 / 10');
    expect(mockConsoleLog).toHaveBeenCalledWith('No more users to process');
    expect(mockConsoleLog).toHaveBeenCalledWith('\nBackfill complete:');
    expect(mockConsoleLog).toHaveBeenCalledWith('  Total processed: 3');
    expect(upsertUserContacts).toHaveBeenCalledTimes(1);
  });

  it('applies date range filters when fromDateIso and toDateIso provided', async () => {
    const mockUsers = [
      {
        docketNumber: '101-20',
        userId: 'user-1',
        address1: '123 Main St',
        city: 'Washington',
        state: 'DC',
        zip: '20001',
      },
    ];
    const whereSpy = jest.fn().mockReturnThis();
    let callCount = 0;
    getDbReader.mockImplementation(cb => {
      callCount++;
      const result =
        callCount === 1 ? { count: 1 } : callCount === 2 ? mockUsers : [];
      const chain = createChainable(result, result);
      (chain as any).where = whereSpy;
      const mockDb = { selectFrom: () => chain };
      return Promise.resolve(cb(mockDb as any));
    });
    ask.mockResolvedValue('y');

    const mockAdd = jest.fn(
      (_id, _addr, cb: (r: { lat: number; lon: number }) => void) => {
        cb({ lat: 38.9, lon: -77.0 });
      },
    );
    Geocoder.mockImplementation(
      () =>
        ({
          add: mockAdd,
          geocode: jest.fn().mockResolvedValue(undefined),
        }) as any,
    );

    await backfillUserGeocodes({
      fromDateIso: '2024-01-01T00:00:00.000Z',
      toDateIso: '2024-12-31T23:59:59.999Z',
    });

    expect(whereSpy).toHaveBeenCalledWith(
      'c.receivedAt',
      '>=',
      expect.any(Date),
    );
    expect(whereSpy).toHaveBeenCalledWith(
      'c.receivedAt',
      '<',
      expect.any(Date),
    );
  });

  it('logs custom batchSize and delayMs', async () => {
    let callCount = 0;
    getDbReader.mockImplementation(cb => {
      callCount++;
      const result = callCount === 1 ? { count: 5 } : [];
      const chain = createChainable(result, result);
      const mockDb = { selectFrom: () => chain };
      return Promise.resolve(cb(mockDb as any));
    });
    ask.mockResolvedValue('y');

    await backfillUserGeocodes({
      batchSize: 500,
      delayMs: 1000,
    });

    expect(mockConsoleLog).toHaveBeenCalledWith(
      'Starting geocode backfill (batchSize=500, delayMs=1000)',
    );
  });

  it('logs completion summary', async () => {
    const mockUsers = [
      {
        docketNumber: '101-20',
        userId: 'user-1',
        address1: '123 Main St',
        city: 'Washington',
        state: 'DC',
        zip: '20001',
      },
    ];

    let callCount = 0;
    getDbReader.mockImplementation(cb => {
      callCount++;
      const result =
        callCount === 1 ? { count: 1 } : callCount === 2 ? mockUsers : [];
      const chain = createChainable(result, result);
      const mockDb = { selectFrom: () => chain };
      return Promise.resolve(cb(mockDb as any));
    });
    ask.mockResolvedValue('y');

    const mockAdd = jest.fn(
      (_id, _addr, cb: (r: { lat: number; lon: number }) => void) => {
        cb({ lat: 38.9, lon: -77.0 });
      },
    );
    Geocoder.mockImplementation(
      () =>
        ({
          add: mockAdd,
          geocode: jest.fn().mockResolvedValue(undefined),
        }) as any,
    );

    await backfillUserGeocodes({});

    expect(mockConsoleLog).toHaveBeenCalledWith('\nBackfill complete:');
    expect(mockConsoleLog).toHaveBeenCalledWith('  Total processed: 1');
  });
});
