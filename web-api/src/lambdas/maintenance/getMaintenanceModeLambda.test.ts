jest.mock('@web-api/persistence/postgres/featureFlag/getMaintenanceMode');
jest.mock('@web-api/business/useCases/getMaintenanceModeInteractor', () => ({
  getMaintenanceModeInteractor: jest.fn(),
}));

import { getMaintenanceModeInteractor as getMaintenanceModeInteractorMock } from '@web-api/business/useCases/getMaintenanceModeInteractor';
import { getMaintenanceModeLambda } from './getMaintenanceModeLambda';

const getMaintenanceModeInteractor = jest.mocked(
  getMaintenanceModeInteractorMock,
);

const REQUEST_EVENT = { body: {}, headers: {} };

describe('getMaintenanceModeLambda', () => {
  const ORIGINAL_READ_ONLY_MODE = process.env.READ_ONLY_MODE;

  beforeEach(() => {
    getMaintenanceModeInteractor.mockResolvedValue(false);
  });

  afterAll(() => {
    process.env.READ_ONLY_MODE = ORIGINAL_READ_ONLY_MODE;
  });

  it('returns maintenanceMode and readOnlyMode in an object', async () => {
    process.env.READ_ONLY_MODE = 'false';

    const result = await getMaintenanceModeLambda(REQUEST_EVENT);

    const body = JSON.parse(result.body);
    expect(body).toEqual({
      maintenanceMode: false,
      readOnlyMode: false,
    });
  });

  it('returns readOnlyMode=true when the READ_ONLY_MODE env variable is set to "true"', async () => {
    process.env.READ_ONLY_MODE = 'true';

    const result = await getMaintenanceModeLambda(REQUEST_EVENT);

    const body = JSON.parse(result.body);
    expect(body.readOnlyMode).toEqual(true);
  });

  it('returns readOnlyMode=false when the READ_ONLY_MODE env variable is absent', async () => {
    delete process.env.READ_ONLY_MODE;

    const result = await getMaintenanceModeLambda(REQUEST_EVENT);

    const body = JSON.parse(result.body);
    expect(body.readOnlyMode).toEqual(false);
  });

  it('returns readOnlyMode=false when the READ_ONLY_MODE env variable is any value other than the literal "true"', async () => {
    process.env.READ_ONLY_MODE = 'True';

    const result = await getMaintenanceModeLambda(REQUEST_EVENT);

    const body = JSON.parse(result.body);
    expect(body.readOnlyMode).toEqual(false);
  });

  it('returns the value of maintenanceMode as fetched from the interactor', async () => {
    process.env.READ_ONLY_MODE = 'false';
    getMaintenanceModeInteractor.mockResolvedValue(true);

    const result = await getMaintenanceModeLambda(REQUEST_EVENT);

    const body = JSON.parse(result.body);
    expect(body.maintenanceMode).toEqual(true);
  });
});
