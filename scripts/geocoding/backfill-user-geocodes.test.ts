jest.mock('../helpers/parseArgsAndEnvVars', () => ({
  parseArgsAndEnvVars: jest.fn(),
}));
jest.mock('scripts/helpers/backfillUserGeocodes', () => ({
  backfillUserGeocodes: jest.fn().mockResolvedValue(undefined),
}));

import { parseArgsAndEnvVars } from '../helpers/parseArgsAndEnvVars';
import { backfillUserGeocodes } from 'scripts/helpers/backfillUserGeocodes';

const parseArgsMock = jest.mocked(parseArgsAndEnvVars);
const backfillMock = jest.mocked(backfillUserGeocodes);

describe('backfill-user-geocodes script', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    parseArgsMock.mockReturnValue({ batchSize: 10000, delayMs: 60000 } as any);
    backfillMock.mockResolvedValue(undefined);
  });

  it('calls parseArgsAndEnvVars with scriptConfig and backfillUserGeocodes with parsed batchSize and delayMs', async () => {
    await import('./backfill-user-geocodes');
    await new Promise(r => setImmediate(r));

    expect(parseArgsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        description:
          'backfill-user-geocodes - Geocode addresses for users missing lat/lng',
        environment: { env: 'ENV', region: 'REGION' },
        parameters: expect.objectContaining({
          batchSize: { default: '10000', type: 'string' },
          delayMs: { default: '60000', type: 'string' },
        }),
        requireActiveAwsSession: true,
      }),
    );
    expect(backfillMock).toHaveBeenCalledWith({
      batchSize: 10000,
      delayMs: 60000,
    });
  });

  it('passes custom batchSize and delayMs when provided via parseArgsAndEnvVars', async () => {
    jest.resetModules();
    const parseArgsModule = require('../helpers/parseArgsAndEnvVars');
    jest.mocked(parseArgsModule.parseArgsAndEnvVars).mockReturnValue({
      batchSize: 500,
      delayMs: 1000,
    } as any);

    await import('./backfill-user-geocodes');
    await new Promise(r => setImmediate(r));

    const backfillModule = require('scripts/helpers/backfillUserGeocodes');
    expect(jest.mocked(backfillModule.backfillUserGeocodes)).toHaveBeenCalledWith({
      batchSize: 500,
      delayMs: 1000,
    });
  });
});
