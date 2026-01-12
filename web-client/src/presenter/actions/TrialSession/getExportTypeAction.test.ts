import { getExportTypeAction } from './getExportTypeAction';
import { runAction } from '@web-client/presenter/test.cerebral';
import { presenter } from '../../presenter-mock';

jest.mock('@shared/business/utilities/DateHandler', () => {
  const originalModule = jest.requireActual(
    '@shared/business/utilities/DateHandler',
  );
  return {
    __esModule: true,
    ...originalModule,
    formatNow: jest.fn().mockReturnValue('2025'),
  };
});

describe('getExportTypeAction', () => {
  const pathEligibleCasesStub = jest.fn();
  const pathBlockedCasesStub = jest.fn();
  presenter.providers.path = {
    eligibleCases: pathEligibleCasesStub,
    blockedCases: pathBlockedCasesStub,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call path.eligibleCases with correctly formatted fileName when currentTab is "eligibleCases"', async () => {
    await runAction(getExportTypeAction, {
      modules: { presenter },
      state: {
        trialLocationPage: {
          currentTab: 'eligibleCases',
          location: 'Washington, DC',
        },
      },
    });

    expect(pathEligibleCasesStub).toHaveBeenCalledWith({
      fileName: 'Eligible Cases - Washington_DC_2025',
    });
    expect(pathBlockedCasesStub).not.toHaveBeenCalled();
  });

  it('should call path.blockedCases with correctly formatted fileName when currentTab is not "eligibleCases"', async () => {
    await runAction(getExportTypeAction, {
      modules: { presenter },
      state: {
        trialLocationPage: {
          currentTab: 'blockedCases',
          location: 'Houston, TX',
        },
      },
    });

    expect(pathBlockedCasesStub).toHaveBeenCalledWith({
      fileName: 'Blocked Cases Report - Houston_TX_2025',
    });
    expect(pathEligibleCasesStub).not.toHaveBeenCalled();
  });
});
